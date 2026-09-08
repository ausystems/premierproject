import { useEffect } from "react";

interface ImagePreloaderProps {
  images: string[];
}

const ImagePreloader = ({ images }: ImagePreloaderProps) => {
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src) => {
        const image = new Image();
        image.src = src;
        image.loading = "eager";
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadImages, { timeout: 1000 });
    } else {
      setTimeout(preloadImages, 100);
    }
  }, [images]);

  return null;
};

export default ImagePreloader;
