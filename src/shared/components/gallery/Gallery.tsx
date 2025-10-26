"use client";

import { PlayIcon, X } from "lucide-react"; // Import X for the close button
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type ChildPost = {
  igId: string;
  type: "Image" | "Video";
  caption?: string;
  displayUrl?: string;
  images?: string[];
  videoUrl?: string | null;
  shortcode?: string;
};

type Post = {
  _id: string;
  type: "Sidecar" | "Video" | "Image";
  caption?: string;
  displayUrl?: string;
  images?: string[];
  videoUrl?: string | null;
  childPosts?: ChildPost[];
};

export default function Gallery({ posts }: { posts: Post[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [childIndex, setChildIndex] = useState(0);
  const modalContentRef = useRef<HTMLDivElement>(null); // Ref for the actual content box
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activePost = activeIndex !== null ? posts[activeIndex] : null;

  // Build slides for modal: parent + children
  const allSlides = activePost
    ? activePost.type === "Sidecar" && activePost.childPosts
      ? activePost.childPosts
      : [activePost]
    : [];

  const handleClose = () => {
    setActiveIndex(null);
    setChildIndex(0);
  };

  const handleSwipe = () => {
    if (allSlides.length <= 1) return;
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50) {
      // Swipe left (next)
      setChildIndex((prev) => (prev === allSlides.length - 1 ? 0 : prev + 1));
    } else if (swipeDistance < -50) {
      // Swipe right (prev)
      setChildIndex((prev) => (prev === 0 ? allSlides.length - 1 : prev - 1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (activePost) {
      if (e.key === "ArrowRight") {
        setChildIndex((prev) => (prev === allSlides.length - 1 ? 0 : prev + 1));
      } else if (e.key === "ArrowLeft") {
        setChildIndex((prev) => (prev === 0 ? allSlides.length - 1 : prev - 1));
      } else if (e.key === "Escape") {
        handleClose();
      }
    }
  };

  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activePost, allSlides.length]);

  const currentSlide = allSlides[childIndex];

  return (
    <div className="min-h-screen w-full p-8 font-sans">
      <div className=" ">
        
        {/* Masonry Grid */}
        <div className="columns-1 md:columns-3 lg:columns-4  w-full gap-9 space-y-9">
          {posts.map((post, i) => {
            const thumbnail = post.displayUrl;

            return (
              <div
                key={post._id}
                className="relative group break-inside-avoid cursor-pointer flex-1 overflow-hidden transition-all hover:scale-[1.02] bg-gray-100"
                onClick={() => {
                  setActiveIndex(i);
                  setChildIndex(0);
                }}
                >
                {post.type === "Video" ? (
                  <div className="relative w-full h-88">
                  <video
                    src={post.videoUrl ?? post.displayUrl ?? ""}
                    poster={post.displayUrl ?? post.images?.[0] ?? ""}
                    className="w-full h-88 object-cover "
                    muted
                    loop
                    playsInline
                  />
                  {/* Play icon overlay on top of the video poster */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/40 w-12 h-12 flex items-center justify-center aspect-square text-white rounded-full p-2 text-2xl">
                     <PlayIcon />
                    </div>
                  </div>
                  </div>
                ) : (
                  thumbnail && (
                  <Image
                    width={400}
                    height={400}
                    src={thumbnail}
                    alt={post.caption || "Instagram post"}
                    loading="lazy"
                    className="w-full h-88 object-cover transition-transform group-hover:scale-110"
                  />
                  )
                )}

                {post.type === "Sidecar" && post.childPosts && post.childPosts.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    +{post.childPosts.length}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal (Click on overlay closes it) */}
      {activePost && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleClose} // Closes the modal if user clicks the backdrop
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchMove={(e) => (touchEndX.current = e.touches[0].clientX)}
          onTouchEnd={handleSwipe}
        >
          {/* Active Content Container (The actual media and caption box) */}
          <div 
            ref={modalContentRef}
            className="relative flex flex-col items-center max-w-4xl w-full max-h-[95vh] mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl transition-transform duration-300 transform scale-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Important: Prevents clicks inside the content from closing the modal
          >
            {/* Close button inside content box */}
            <button
              className="absolute top-3 right-3 text-white bg-black/50 p-1 rounded-full z-20 hover:bg-black/70 transition-colors"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Nav arrows for desktop */}
            {allSlides.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 text-white text-5xl transition-transform hover:scale-110 hidden md:block opacity-70 hover:opacity-100"
                  onClick={() =>
                    setChildIndex((prev) => (prev === 0 ? allSlides.length - 1 : prev - 1))
                  }
                >
                  ‹
                </button>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 text-white text-5xl transition-transform hover:scale-110 hidden md:block opacity-70 hover:opacity-100"
                  onClick={() =>
                    setChildIndex((prev) => (prev === allSlides.length - 1 ? 0 : prev + 1))
                  }
                >
                  ›
                </button>
              </>
            )}

            {/* Media Area: Uses object-contain to fit within max-h/max-w */}
            <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden">
              {currentSlide?.type === "Video" ? (
                <video
                  src={currentSlide.videoUrl ?? currentSlide.displayUrl ?? ""}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain bg-gray-800"
                />
              ) : (
                <img
                  src={currentSlide?.displayUrl ?? "/assets/bg/hero.jpg"}
                  alt={currentSlide?.caption ?? "Post image"}
                  className="max-w-full max-h-full object-contain bg-gray-800"
                />
              )}
            </div>

            {/* Caption Area (Conditionally Renders) */}
            {currentSlide?.caption && (
              <div className="p-4 w-full text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                <p className="line-clamp-4">{currentSlide.caption}</p>
              </div>
            )}
            
            {/* Slide Index Indicator */}
            {allSlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full z-10">
                    {childIndex + 1} / {allSlides.length}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}