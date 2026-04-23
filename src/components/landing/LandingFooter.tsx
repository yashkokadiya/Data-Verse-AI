import { Sparkles, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FooterCol = ({
  title,
  links,
  navigate,
}: {
  title: string;
  links: { label: string; to: string }[];
  navigate: (to: string) => void;
}) => (
  <div>
    <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <button
            onClick={() => l.to !== "#" && navigate(l.to)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
          >
            {l.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">DataVerse AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">
              A premium AI data intelligence platform that turns raw data into smart, actionable insights.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github, Mail].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Product"
            navigate={navigate}
            links={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Full Pipeline", to: "/workflow" },
              { label: "Insights", to: "/dashboard/insights" },
              { label: "Forecasting", to: "/dashboard/forecasting" },
            ]}
          />

          <FooterCol
            title="Company"
            navigate={navigate}
            links={[
              { label: "About", to: "#" },
              { label: "Careers", to: "#" },
              { label: "Blog", to: "#" },
              { label: "Contact", to: "#" },
            ]}
          />

          <FooterCol
            title="Legal"
            navigate={navigate}
            links={[
              { label: "Privacy", to: "#" },
              { label: "Terms", to: "#" },
              { label: "Security", to: "#" },
              { label: "Cookies", to: "#" },
            ]}
          />
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 DataVerse AI. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with precision · v1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
