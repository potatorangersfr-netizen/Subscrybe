'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Download, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const memes = [
  { id: 1, src: '/memes/meme1.jpg', title: 'Cardano Meme 1' },
  { id: 2, src: '/memes/meme2.jpg', title: 'Cardano Meme 2' },
  { id: 3, src: '/memes/meme3.jpg', title: 'Cardano Meme 3' },
  { id: 4, src: '/memes/meme4.jpg', title: 'Cardano Meme 4' },
  { id: 5, src: '/memes/meme5.jpg', title: 'Cardano Meme 5' },
  { id: 6, src: '/memes/meme6.jpg', title: 'Cardano Meme 6' },
  { id: 7, src: '/memes/meme7.jpg', title: 'Cardano Meme 7' },
  { id: 8, src: '/memes/meme8.jpg', title: 'Cardano Meme 8' },
  { id: 9, src: '/memes/meme9.jpg', title: 'Cardano Meme 9' },
];

export default function MemesPage() {
  const [selectedMeme, setSelectedMeme] = useState<typeof memes[0] | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({});

  const handleLike = (id: number) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDownload = (src: string, title: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title;
    link.click();
  };

  return (
    <div className="min-h-screen bg-dark-gradient p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#e5e5e5' }}>
            Cardano Memes Gallery 🎭
          </h1>
          <p className="text-xl" style={{ color: '#8a8a8a' }}>
            Our collection of Cardano-themed memes. Click to view full size!
          </p>
        </motion.div>

        {/* Memes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedMeme(meme)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#334155] hover:border-[#0033AD] transition-all duration-300">
                <Image
                  src={meme.src}
                  alt={meme.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold mb-2">{meme.title}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(meme.id);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Heart className="h-4 w-4" />
                        {likes[meme.id] || 0}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(meme.src, meme.title);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedMeme && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMeme(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedMeme(null)}
                  className="absolute -top-12 right-0 text-white hover:text-[#00D4AA] transition-colors"
                >
                  <X className="h-8 w-8" />
                </button>

                {/* Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={selectedMeme.src}
                    alt={selectedMeme.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white">{selectedMeme.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleLike(selectedMeme.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {likes[selectedMeme.id] || 0} Likes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDownload(selectedMeme.src, selectedMeme.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="secondary">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
