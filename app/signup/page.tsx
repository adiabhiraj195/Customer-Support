"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Headphones,
  Info,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { useAuth, useOrganisations } from "@/hooks/useAuth";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { UserRole } from "@/types/api";

const ORG_TYPES = [
  "Technology",
  "Enterprise",
  "Financial Services",
  "Healthcare",
  "E-Commerce",
  "Education",
  "Consulting",
  "Other",
];

export default function SignupPage() {
  const router = useRouter();
  const {
    registerAdmin,
    registerCustomer,
    registerSupportAgent,
    isRegistering,
    registerError,
    isAuthenticated,
  } = useAuth();

  const { data: orgsData, isLoading: isLoadingOrgs } = useOrganisations();
  const organisations = orgsData?.data?.organisations || [];

  const [role, setRole] = useState<UserRole>("Customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Admin-specific fields
  const [adminOrgName, setAdminOrgName] = useState("");
  const [adminOrgType, setAdminOrgType] = useState("Technology");
  const [adminOrgDomain, setAdminOrgDomain] = useState("");

  // Customer / Support Agent organisation fields
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [customOrgName, setCustomOrgName] = useState("");
  const [isCustomOrg, setIsCustomOrg] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  // State for Support Agent pending approval screen after successful registration
  const [pendingAgentState, setPendingAgentState] = useState<{
    email: string;
    orgName: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (role === "Admin") {
        if (!adminOrgName.trim()) {
          setLocalError("Organisation name is required for Admin registration.");
          return;
        }

        await registerAdmin({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
          organisationName: adminOrgName.trim(),
          organisationType: adminOrgType,
          organisationConfig: adminOrgDomain.trim()
            ? { domain: adminOrgDomain.trim() }
            : undefined,
        });

        router.push("/conversation");
        return;
      }

      if (role === "Support Agent") {
        const orgId = !isCustomOrg ? selectedOrgId : undefined;
        const orgName = isCustomOrg
          ? customOrgName.trim()
          : organisations.find((o) => o.id === selectedOrgId)?.name ||
            customOrgName.trim();

        if (!orgId && !orgName) {
          setLocalError(
            "Please select an existing organisation or enter your organisation name."
          );
          return;
        }

        const res = await registerSupportAgent({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
          organisationId: orgId || undefined,
          organisationName: !orgId ? orgName : undefined,
        });

        const effectiveOrgName =
          res.data?.organisation?.name || orgName || "your organisation";

        // Show pending approval confirmation screen
        setPendingAgentState({
          email: email.trim(),
          orgName: effectiveOrgName,
        });
        return;
      }

      // Customer role
      const orgId = !isCustomOrg ? selectedOrgId : undefined;
      const orgName = isCustomOrg
        ? customOrgName.trim()
        : organisations.find((o) => o.id === selectedOrgId)?.name ||
          customOrgName.trim();

      if (!orgId && !orgName && organisations.length > 0 && !isCustomOrg) {
        setLocalError(
          "Please select an organisation to associate your customer account with."
        );
        return;
      }

      await registerCustomer({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        organisationId: orgId || undefined,
        organisationName: orgName || undefined,
      });

      router.push("/conversation");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setLocalError(message);
    }
  };

  // 1. If Support Agent just registered, show the dedicated Pending Approval confirmation screen
  if (pendingAgentState) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
        <Card className="w-full max-w-lg p-8 space-y-6 text-center border-warning-border">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-warning-subtle text-warning-subtle-foreground mx-auto shadow-xs">
            <Clock className="h-8 w-8 text-warning animate-pulse" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning" size="md" className="mx-auto">
              PENDING ADMIN APPROVAL
            </Badge>
            <CardTitle className="text-2xl font-bold">
              Registration Submitted
            </CardTitle>
            <CardDescription className="text-sm">
              Your Support Agent account for{" "}
              <strong className="text-foreground">
                {pendingAgentState.orgName}
              </strong>{" "}
              has been registered successfully.
            </CardDescription>
          </div>

          <div className="rounded-2xl border border-border bg-card-muted/50 p-4 text-left text-xs space-y-2.5 text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">
                  Approval Requirement:
                </strong>{" "}
                Per security architecture, Support Agents must be approved by an
                Organisation Admin before acquiring access to conversations or
                support tasks.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Account Email:</strong>{" "}
                <code className="text-foreground font-mono">
                  {pendingAgentState.email}
                </code>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
              <span>
                Once your administrator reviews and approves your account from
                the Admin Portal, you will be able to log in and access all
                support operations.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="primary" className="w-full" size="md">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="md">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // 2. Active Session view
  if (isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
            <Bot className="h-7 w-7" />
          </div>
          <CardTitle className="mb-2">Active Session Detected</CardTitle>
          <CardDescription className="mb-6">
            You are already authenticated. You can jump directly into your
            conversations or knowledge base.
          </CardDescription>
          <div className="flex flex-col gap-2.5">
            <Link href="/conversation">
              <Button className="w-full" size="md">
                Go to Conversations
              </Button>
            </Link>
            <Link href="/knowledgebase">
              <Button variant="outline" className="w-full" size="md">
                Knowledge Base
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <Card className="w-full max-w-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs mb-1">
            <Bot className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm">
            Select your role to configure workspace access and privileges
          </CardDescription>
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Your Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Customer Role */}
            <button
              type="button"
              onClick={() => {
                setRole("Customer");
                setLocalError(null);
              }}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                role === "Customer"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-card-muted/40 hover:bg-card hover:border-border-subtle"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-1.5 rounded-xl ${
                    role === "Customer"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                </div>
                <Badge
                  variant={role === "Customer" ? "default" : "outline"}
                  size="sm"
                >
                  Active
                </Badge>
              </div>
              <span className="font-semibold text-sm text-foreground">
                User / Customer
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                Standard conversational & AI retrieval access
              </span>
            </button>

            {/* Support Agent Role */}
            <button
              type="button"
              onClick={() => {
                setRole("Support Agent");
                setLocalError(null);
              }}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                role === "Support Agent"
                  ? "border-warning bg-warning-subtle/40 ring-2 ring-warning/20 shadow-xs"
                  : "border-border bg-card-muted/40 hover:bg-card hover:border-border-subtle"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-1.5 rounded-xl ${
                    role === "Support Agent"
                      ? "bg-warning text-warning-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <Headphones className="h-4 w-4" />
                </div>
                <Badge
                  variant={role === "Support Agent" ? "warning" : "outline"}
                  size="sm"
                >
                  Pending
                </Badge>
              </div>
              <span className="font-semibold text-sm text-foreground">
                Support Agent
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                Organisation support with Admin approval gate
              </span>
            </button>

            {/* Admin Role */}
            <button
              type="button"
              onClick={() => {
                setRole("Admin");
                setLocalError(null);
              }}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                role === "Admin"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-card-muted/40 hover:bg-card hover:border-border-subtle"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-1.5 rounded-xl ${
                    role === "Admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <Badge
                  variant={role === "Admin" ? "default" : "outline"}
                  size="sm"
                >
                  Full Access
                </Badge>
              </div>
              <span className="font-semibold text-sm text-foreground">
                Administrator
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                Create organisation & manage support agents
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Role Access Level Overview Banner */}
        <div
          className={`rounded-2xl p-3.5 text-xs flex items-start gap-2.5 border transition-all ${
            role === "Customer"
              ? "bg-primary/5 border-primary/20 text-foreground"
              : role === "Support Agent"
              ? "bg-warning-subtle border-warning-border text-warning-subtle-foreground"
              : "bg-card-muted/80 border-border text-foreground"
          }`}
        >
          {role === "Customer" && (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  Immediate Access Level (POST /auth/register/customer)
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Customers are active immediately upon registration. You can
                  join conversations, ask questions, and retrieve knowledge
                  sourced from your organisation.
                </p>
              </div>
            </>
          )}

          {role === "Support Agent" && (
            <>
              <Clock className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-warning-foreground">
                  Pending Approval Required (POST /auth/register/support-agent)
                </p>
                <p className="opacity-90 mt-0.5">
                  Support Agents are registered with status{" "}
                  <code>PENDING_APPROVAL</code>. Per security policies, you will
                  have restricted task access until your organisation admin
                  verifies and approves your profile.
                </p>
              </div>
            </>
          )}

          {role === "Admin" && (
            <>
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  Organisation Owner & Admin (POST /auth/register/admin)
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Admins establish a new organisation. You will have full
                  privileges to ingest knowledge documents, review Support
                  Agents, and approve or reject agent registrations.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Error Alert */}
        {(localError || registerError) && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <span>{localError || (registerError as Error)?.message}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common fields: Name, Email, Password */}
          <Input
            id="name"
            type="text"
            label="Full Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            leftIcon={<User className="h-4 w-4" />}
          />

          <Input
            id="email"
            type="email"
            required
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <Input
            id="password"
            type="password"
            required
            minLength={6}
            label="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
          />

          {/* ADMIN-SPECIFIC FIELDS: Create Organisation */}
          {role === "Admin" && (
            <div className="p-4 rounded-2xl border border-border bg-card-muted/30 space-y-3.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  New Organisation Setup
                </span>
              </div>

              <Input
                id="adminOrgName"
                type="text"
                required
                label="Organisation Name"
                value={adminOrgName}
                onChange={(e) => setAdminOrgName(e.target.value)}
                placeholder="e.g. Acme Technologies"
                leftIcon={<Building2 className="h-4 w-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="adminOrgType"
                    className="block text-xs font-medium text-foreground"
                  >
                    Organisation Sector / Type
                  </label>
                  <select
                    id="adminOrgType"
                    value={adminOrgType}
                    onChange={(e) => setAdminOrgType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card-muted/60 text-foreground py-2.5 px-3 text-sm transition-all focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    {ORG_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  id="adminOrgDomain"
                  type="text"
                  label="Organisation Domain (Optional)"
                  value={adminOrgDomain}
                  onChange={(e) => setAdminOrgDomain(e.target.value)}
                  placeholder="acme.com"
                  leftIcon={<Globe className="h-4 w-4" />}
                />
              </div>
            </div>
          )}

          {/* CUSTOMER & SUPPORT AGENT FIELDS: Select or Enter Organisation */}
          {role !== "Admin" && (
            <div className="p-4 rounded-2xl border border-border bg-card-muted/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Target Organisation
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomOrg(!isCustomOrg);
                    setLocalError(null);
                  }}
                  className="text-xs text-primary hover:text-primary-hover underline underline-offset-2 font-medium"
                >
                  {isCustomOrg
                    ? "Choose from directory"
                    : "Enter custom name instead"}
                </button>
              </div>

              {!isCustomOrg ? (
                <div className="space-y-1">
                  <label
                    htmlFor="selectOrg"
                    className="block text-xs font-medium text-foreground"
                  >
                    Select Existing Organisation
                  </label>
                  {isLoadingOrgs ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card-muted/50 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 animate-spin text-primary" />
                      Loading organisations directory...
                    </div>
                  ) : organisations.length > 0 ? (
                    <select
                      id="selectOrg"
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card-muted/60 text-foreground py-2.5 px-3 text-sm transition-all focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="">-- Choose an Organisation --</option>
                      {organisations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} {org.type ? `(${org.type})` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        No public organisations currently registered. Please
                        enter your organisation name below.
                      </p>
                      <Input
                        id="customOrgFallback"
                        type="text"
                        value={customOrgName}
                        onChange={(e) => setCustomOrgName(e.target.value)}
                        placeholder="e.g. Acme Technologies"
                        leftIcon={<Building2 className="h-4 w-4" />}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  id="customOrg"
                  type="text"
                  label="Organisation Name"
                  value={customOrgName}
                  onChange={(e) => setCustomOrgName(e.target.value)}
                  placeholder="e.g. Acme Technologies"
                  leftIcon={<Building2 className="h-4 w-4" />}
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isRegistering}
            className="w-full mt-2"
            size="md"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {role === "Admin"
              ? "Create Admin Account & Organisation"
              : role === "Support Agent"
              ? "Register Support Agent"
              : "Create Customer Account"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
          >
            Sign in instead
          </Link>
        </div>
      </Card>
    </div>
  );
}
