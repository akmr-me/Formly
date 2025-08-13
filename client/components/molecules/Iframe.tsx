import { isValidUrl } from "@/lib/utils";

interface IframeProps {
  src: string;
  title?: string;
  className?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  sandbox?: string[];
  allow?: string[];
  width?: string | number;
  height?: string | number;
}

const Iframe: React.FC<IframeProps> = ({
  src,
  title = "Embedded Content",
  className = "w-full max-w-xl aspect-video mx-auto border-0",
  loading = "lazy",
  referrerPolicy = "no-referrer-when-downgrade",
  sandbox = [
    "allow-scripts",
    "allow-same-origin",
    "allow-popups",
    "allow-forms",
  ],
  allow = ["fullscreen"],
  width,
  height,
}) => {
  if (!src || !isValidUrl(src)) {
    return (
      <div className="w-full max-w-2xl aspect-video mx-auto border border-red-300 bg-red-50 flex items-center justify-center rounded-lg">
        <p className="text-red-600 text-sm">Invalid or missing URL</p>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      loading={loading}
      referrerPolicy={referrerPolicy}
      sandbox={sandbox.join(" ")}
      allow={allow.join("; ")}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default Iframe;
