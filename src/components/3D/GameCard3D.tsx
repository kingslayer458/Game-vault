import { useRef, useState, useCallback, memo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Plane } from '@react-three/drei';
import { TextureLoader, DoubleSide, Texture } from 'three';
import { Link } from 'react-router-dom';
import { Star, Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Game } from '../../lib/api';
import { useWishlistStore } from '../../stores/wishlist';
import { VideoPreview } from '../VideoPreview';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80';

interface GameCard3DProps {
  game: Game;
  index: number;
}

// 3D Card Component with robust texture loading
function Card3D({ imageUrl, isHovered }: { imageUrl: string; isHovered: boolean }) {
  const meshRef = useRef<any>();
  const [texture, setTexture] = useState<Texture | undefined>(undefined);
  const [hasTextureError, setHasTextureError] = useState(false);

  // Manual texture loading with error handling
  useEffect(() => {
    const loader = new TextureLoader();
    
    loader.load(
      imageUrl,
      // onLoad
      (loadedTexture) => {
        setTexture(loadedTexture);
        setHasTextureError(false);
      },
      // onProgress
      undefined,
      // onError
      (error) => {
        console.warn('Failed to load texture:', imageUrl, error);
        setHasTextureError(true);
        setTexture(undefined);
        
        // Try loading fallback image
        if (imageUrl !== FALLBACK_IMAGE) {
          loader.load(
            FALLBACK_IMAGE,
            (fallbackTexture) => {
              setTexture(fallbackTexture);
              setHasTextureError(false);
            },
            undefined,
            (fallbackError) => {
              console.error('Failed to load fallback texture:', fallbackError);
              setHasTextureError(true);
              setTexture(undefined);
            }
          );
        }
      }
    );

    return () => {
      // Cleanup texture on unmount
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      if (isHovered) {
        meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2;
        meshRef.current.scale.setScalar(1.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02);
      } else {
        meshRef.current.position.z = 0;
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={meshRef}>
      <Box args={[4, 2.5, 0.1]} position={[0, 0, 0]}>
        {texture && !hasTextureError ? (
          <meshStandardMaterial 
            map={texture} 
            metalness={0.3}
            roughness={0.4}
          />
        ) : (
          <meshBasicMaterial 
            color="#374151" 
            transparent 
            opacity={0.8}
          />
        )}
      </Box>
      
      {/* Glowing edges */}
      <Box args={[4.1, 2.6, 0.05]} position={[0, 0, -0.05]}>
        <meshBasicMaterial 
          color={isHovered ? "#3b82f6" : "#1f2937"} 
          transparent 
          opacity={isHovered ? 0.8 : 0.3}
        />
      </Box>
      
      {/* Floating particles */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <Box 
              key={i} 
              args={[0.02, 0.02, 0.02]} 
              position={[
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 3,
                Math.random() * 2
              ]}
            >
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
            </Box>
          ))}
        </>
      )}
    </group>
  );
}

const MetacriticBadge = memo(({ score }: { score: number }) => (
  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium z-10">
    <span className={cn({
      'text-green-500': score >= 75,
      'text-yellow-500': score >= 50 && score < 75,
      'text-red-500': score < 50
    })}>
      {score}
    </span>
  </div>
));

export const GameCard3D = memo(function GameCard3D({ game, index }: GameCard3DProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(game.id);
  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [validImageUrl, setValidImageUrl] = useState<string>(FALLBACK_IMAGE);

  // Pre-validate image URL
  useEffect(() => {
    if (!game.background_image) {
      setValidImageUrl(FALLBACK_IMAGE);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setValidImageUrl(game.background_image);
    };
    
    img.onerror = () => {
      console.warn('Failed to pre-load game image:', game.background_image);
      setValidImageUrl(FALLBACK_IMAGE);
    };
    
    img.src = game.background_image;
  }, [game.background_image]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(game.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(game);
      toast.success('Added to wishlist');
    }
  }, [inWishlist, game.id, addItem, removeItem]);

  const handleMouseEnter = useCallback(() => {
    setShowVideo(true);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowVideo(false);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        rotateX: 5,
        rotateY: 2,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group block perspective-1000"
    >
      <Link to={`/game/${game.id}`}>
        <div 
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform-gpu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 3D Canvas Container */}
          <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="w-full h-full"
              onCreated={({ gl }) => {
                // Configure WebGL context for better error handling
                gl.debug.checkShaderErrors = false;
              }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
              
              <Card3D 
                imageUrl={validImageUrl} 
                isHovered={isHovered}
              />
            </Canvas>
            
            {/* Video Overlay */}
            {game.clip && showVideo && (
              <div className="absolute inset-0 z-20">
                <VideoPreview
                  videoUrl={game.clip.clip}
                  thumbnailUrl={validImageUrl}
                />
              </div>
            )}
            
            {/* Holographic Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 transition-opacity duration-500",
              isHovered && "opacity-100"
            )} />
            
            {/* Metacritic Score */}
            {game.metacritic && <MetacriticBadge score={game.metacritic} />}
            
            {/* Wishlist Button */}
            <button 
              className={cn(
                'absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10',
                inWishlist 
                  ? 'bg-red-500/80 hover:bg-red-600/90 text-white' 
                  : 'bg-black/50 hover:bg-black/70 text-gray-200 hover:text-red-500'
              )}
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>

            {/* Video Preview Indicator */}
            {game.clip && (
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm p-2 rounded-full text-white z-10">
                <Play className="w-4 h-4" />
              </div>
            )}

            {/* Floating Rating */}
            <motion.div
              className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full z-10"
              animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="text-white text-sm font-medium">
                  {game.rating ? game.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Card Content */}
          <div className="p-6 relative">
            {/* Animated Background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-500",
              isHovered && "opacity-100"
            )} />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-300 transition-colors">
                {game.name}
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                {game.released && (
                  <time 
                    dateTime={game.released}
                    className="text-sm text-gray-400"
                  >
                    {new Date(game.released).toLocaleDateString()}
                  </time>
                )}
              </div>
              
              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.genres.slice(0, 2).map((genre) => (
                    <motion.span
                      key={genre.id}
                      className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/50"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                    >
                      {genre.name}
                    </motion.span>
                  ))}
                </div>
              )}
              
              {game.platforms && game.platforms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {game.platforms.slice(0, 3).map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="text-xs text-gray-400"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Glowing Border Effect */}
            <div className={cn(
              "absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500",
              isHovered && "opacity-20"
            )} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});