import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Edit2, Check, X, ZoomIn, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from '../types';

export default function Gallery() {
  const initialPhotos: Photo[] = [
    {
      id: 'photo-1',
      url: '/src/assets/images/couple_silhouette_1784436916675.jpg',
      caption: 'Chasing sunsets hand-in-hand',
      date: 'Summer Days',
      isCustom: false,
    },
    {
      id: 'photo-2',
      url: '/src/assets/images/couple_cherry_blossom_1784436933033.jpg',
      caption: 'Warm smiles and cherry blossom skies',
      date: 'Springtime Bliss',
      isCustom: false,
    },
    {
      id: 'photo-3',
      url: '/src/assets/images/romantic_candlelight_1784436947354.jpg',
      caption: 'A soft, magical dinner together',
      date: 'Anniversary Night',
      isCustom: false,
    },
    {
      id: 'photo-4',
      url: '/src/assets/images/heart_bokeh_lights_1784436960442.jpg',
      caption: 'Every moment with you is golden',
      date: 'Cozy Evenings',
      isCustom: false,
    },
  ];

  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('anniversary_photos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Photo[];
        // Filter out broken custom photos or keep a merge of initial and custom
        const customs = parsed.filter(p => p.isCustom);
        return [...initialPhotos, ...customs];
      } catch (e) {
        return initialPhotos;
      }
    }
    return initialPhotos;
  });

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editingText, setEditingText] = useState('');

  // Persist only custom photos to localStorage
  useEffect(() => {
    const customPhotos = photos.filter(p => p.isCustom);
    localStorage.setItem('anniversary_photos', JSON.stringify(customPhotos));
  }, [photos]);

  // Handle local image file upload -> convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const added: Photo = {
      id: `custom-photo-${Date.now()}`,
      url: newUrl,
      caption: newCaption || 'A magical moment together',
      date: newDate || 'Recently',
      isCustom: true,
    };

    setPhotos(prev => [...prev, added]);
    setNewUrl('');
    setNewCaption('');
    setNewDate('');
    setIsAdding(false);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this memory?')) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      if (activePhoto?.id === id) {
        setActivePhoto(null);
      }
    }
  };

  const handleSaveCaption = () => {
    if (!activePhoto) return;
    setPhotos(prev =>
      prev.map(p => (p.id === activePhoto.id ? { ...p, caption: editingText } : p))
    );
    setActivePhoto(prev => (prev ? { ...prev, caption: editingText } : null));
    setIsEditingCaption(false);
  };

  return (
    <div id="photo-gallery-section" className="py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Camera className="text-rose-500 w-7 h-7" /> Our Memory Gallery
          </h2>
          <p className="text-xs text-rose-300 italic font-serif">
            Capturing the beautiful chapters of our love story
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 hover:scale-[1.03] transition-all cursor-pointer interactive-no-hearts"
        >
          <Plus className="w-4 h-4" /> Add a Photo Memory
        </button>
      </div>

      {/* Gallery Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {photos.map((photo, index) => {
          // Slight rotating angle for polaroid realism based on index
          const rotationAngle = (index % 4 === 0) ? '-2deg' : (index % 4 === 1) ? '2deg' : (index % 4 === 2) ? '-1deg' : '3deg';
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              onClick={() => {
                setActivePhoto(photo);
                setEditingText(photo.caption);
                setIsEditingCaption(false);
              }}
              style={{ rotate: rotationAngle }}
              className="polaroid-card p-4 pb-6 rounded-lg cursor-pointer relative group flex flex-col justify-between backdrop-blur-md"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] bg-rose-950/20 overflow-hidden rounded-md mb-4">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-rose-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-rose-950/80 backdrop-blur-md text-rose-300 shadow-lg border border-white/10">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                {/* Custom/Uploaded indicator or Delete button */}
                {photo.isCustom && (
                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-100 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer border border-white/10"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Caption & Date (Handwritten feeling) */}
              <div>
                <p className="font-fancy text-rose-300 text-lg leading-tight truncate px-1 text-center font-bold group-hover:text-rose-200 transition-colors">
                  {photo.caption}
                </p>
                {photo.date && (
                  <p className="text-[10px] text-rose-300/60 font-mono text-center mt-1">
                    — {photo.date} —
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-rose-950/90 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl relative text-rose-100"
            >
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-rose-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="text-rose-500 w-5 h-5" /> Add New Memory Card
              </h3>

              <form onSubmit={handleAddPhoto} className="space-y-4">
                {/* Custom Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 font-sans">
                    Upload Photo Image
                  </label>
                  {!newUrl ? (
                    <div className="border-2 border-dashed border-white/10 hover:border-rose-500/50 rounded-xl p-6 text-center cursor-pointer hover:bg-white/5 transition-all relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Camera className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-rose-200">Click to upload photo</p>
                      <p className="text-[10px] text-rose-300/60 mt-1">Supports JPG, PNG, GIF</p>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                      <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-950/80 text-rose-300 hover:bg-rose-900 cursor-pointer shadow-sm border border-white/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image URL fallback */}
                <div>
                  <p className="text-center text-xs text-rose-300/60 my-1">— OR —</p>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Paste Image URL (e.g., https://...)"
                    className="w-full px-3 py-2 text-xs bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Handwritten Caption
                  </label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Best weekend trip ever!"
                    maxLength={40}
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-sans">
                    Season or Date
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Autumn 2025"
                    className="w-full px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/30 text-white font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-rose-300 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={!newUrl}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 disabled:opacity-40 cursor-pointer"
                  >
                    Add Memory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Photo Viewer Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-rose-950/95 backdrop-blur-xl p-5 md:p-8 rounded-3xl max-w-2xl w-full border border-white/10 shadow-2xl relative text-rose-100"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute -top-12 sm:top-4 right-4 sm:right-4 p-2 rounded-full bg-white/10 sm:bg-white/5 text-white sm:text-rose-300 hover:text-white cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[4/3] bg-rose-950/40 overflow-hidden rounded-2xl mb-6 shadow-md border border-white/5">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Editable or Display Caption Section */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                  <span className="text-xs font-mono text-rose-300/80 uppercase tracking-widest">
                    {activePhoto.date || 'Romantic Moment'}
                  </span>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                </div>

                {isEditingCaption ? (
                  <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto justify-center mt-3">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-black/40 text-white font-medium font-fancy text-xl text-center"
                      maxLength={45}
                    />
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={handleSaveCaption}
                        className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-lg"
                        title="Save caption"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingCaption(false)}
                        className="p-2 rounded-lg bg-white/5 text-rose-200 hover:bg-white/10 border border-white/10 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <h4 className="font-fancy text-rose-300 text-3xl leading-tight font-bold">
                      {activePhoto.caption}
                    </h4>
                    <button
                      onClick={() => setIsEditingCaption(true)}
                      className="p-1 rounded-full hover:bg-white/10 text-rose-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Caption"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
