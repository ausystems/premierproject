import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onError?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className = "",
  aspectRatio = "1/1",
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}

      {hasError && (
        <div className="absolute inset-0 bg-premier-gray-200 flex items-center justify-center">
          <div className="text-premier-gray-500 text-sm text-center p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            Image not available
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
