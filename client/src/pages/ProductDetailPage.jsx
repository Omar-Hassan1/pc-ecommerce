import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Shield, Globe2, Truck, Check, ChevronRight, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

export default function ProductDetailPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${identifier}`);
        if (res.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          if (res.data.product.images && res.data.product.images.length > 0) {
            setSelectedImage(res.data.product.images[0].imageUrl);
          } else {
            setSelectedImage('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80');
          }
        }
      } catch (err) {
        showToast('Product not found', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <Link to="/shop" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const currentPrice = salePrice || price;
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to write a product review', 'error');
      return;
    }

    try {
      const res = await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.success) {
        showToast('Review submitted successfully!', 'success');
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-200 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Gallery Section */}
        <div className="space-y-4">
          <div className="bg-[#131b2e] border border-gray-800 rounded-3xl p-6 aspect-square flex items-center justify-center relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Thumbnail Selector */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 h-20 rounded-xl bg-gray-900 border-2 p-1 shrink-0 transition-all ${
                    selectedImage === img.imageUrl ? 'border-blue-500 blue-glow' : 'border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Section */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-blue-400 font-extrabold uppercase tracking-widest">
                {product.brand?.name || 'NEXORA'}
              </span>
              <span className="text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-300 font-semibold">{product.averageRating || 5.0}</span>
              <span className="text-gray-500">({product.reviewCount || 12} Verified Customer Reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-gray-400 block uppercase font-semibold">Price</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                {salePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div>
              {product.stockQuantity > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-700 rounded-xl bg-gray-900 text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 blue-glow transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                BUY NOW
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isSaved ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'WISHLISTED' : 'WISHLIST'}
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 pt-2 border-t border-gray-800">
            <span className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-blue-400" /> Insured Worldwide Express Shipping</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> {product.warranty}</span>
          </div>

        </div>

      </div>

      {/* Tabs Section: Description / Specifications / Reviews / Shipping */}
      <div className="space-y-6 pt-10 border-t border-gray-800">
        <div className="flex border-b border-gray-800 gap-8 overflow-x-auto text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition-colors ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Overview & Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 transition-colors ${activeTab === 'specifications' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Verified Reviews ({product.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition-colors ${activeTab === 'shipping' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Worldwide Shipping & Returns
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-6 text-xs text-gray-300 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Product Overview</h3>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Technical Specifications Matrix</h3>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-900/80 border border-gray-800 rounded-xl">
                      <span className="font-bold text-gray-400">{spec.specKey}</span>
                      <span className="font-semibold text-white">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Reviews</h3>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((rev, i) => (
                      <div key={i} className="p-4 bg-gray-900/80 border border-gray-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : 'Verified Customer'}</span>
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 rounded">Verified Buyer</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-200">{rev.title}</h4>
                        <p className="text-gray-400">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-white">Write a Verified Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Rating:</span>
                  <div className="flex text-amber-400 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Review Title..."
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-white"
                />
                <textarea
                  required
                  rows="3"
                  placeholder="Share details about performance, packaging, and build quality..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-white"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Worldwide Shipping & Warranty Info</h3>
              <p>All hardware orders are dispatched in reinforced double-boxed packaging. Tracked international express shipping delivers within 3-7 business days.</p>
              <p>Includes NEXORA 30-day money-back guarantee + full manufacturer warranty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-gray-800">
          <h2 className="text-2xl font-extrabold text-white">Related Hardware & Accessories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
