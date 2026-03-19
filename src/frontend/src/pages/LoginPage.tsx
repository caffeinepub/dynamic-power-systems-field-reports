import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">
                DYNAMIC POWER SYSTEMS
              </p>
              <p className="text-white/70 text-sm">Mysore</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white leading-snug mb-4">
              Field Service
              <br />
              Engineer Portal
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Streamline your service reports, manage job assignments, and
              maintain equipment records — all in one place.
            </p>
          </motion.div>
        </div>
        <div className="space-y-4">
          {[
            { icon: FileText, text: "Create & manage service reports" },
            { icon: CheckCircle, text: "Step-by-step guided reporting" },
            { icon: Shield, text: "Export professional PDF reports" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/85 text-sm">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-xl shadow-card-md p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground text-base leading-tight">
                  DYNAMIC POWER SYSTEMS
                </p>
                <p className="text-muted-foreground text-xs">Mysore</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Sign in to access the field service portal
            </p>

            <Button
              data-ocid="login.primary_button"
              className="w-full bg-primary text-primary-foreground hover:bg-secondary h-11 font-semibold text-sm"
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Secure authentication powered by Internet Identity
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
