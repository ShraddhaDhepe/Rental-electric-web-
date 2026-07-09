import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTag, FaArrowRight, FaSearch } from 'react-icons/fa';
import './BlogPage.css';

const posts = [
  {
    id: 1,
    title: 'Rent vs Buy Electronics: Which is Smarter in 2026?',
    excerpt: 'A comprehensive guide to help you decide whether renting or buying electronics makes more financial sense for your situation.',
    category: 'Guides',
    readTime: '5 min read',
    date: 'June 15, 2026',
    img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    featured: true,
  },
  {
    id: 2,
    title: '5 Reasons to Rent Your AC This Summer',
    excerpt: 'With summer temperatures soaring, discover why thousands of Indians are choosing to rent their air conditioners instead of buying.',
    category: 'Tips',
    readTime: '3 min read',
    date: 'May 28, 2026',
    img: 'https://images.unsplash.com/photo-1601146800832-90f9e4a25f3e?w=400',
  },
  {
    id: 3,
    title: 'How to Choose the Right Rental Plan for Your Needs',
    excerpt: 'A 3-month plan vs a 12-month plan — what are the real savings? We break down the numbers clearly for popular product categories.',
    category: 'Guides',
    readTime: '4 min read',
    date: 'May 10, 2026',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
  },
  {
    id: 4,
    title: 'TV Buying Guide 2026: Which Size and Tech is Right for You?',
    excerpt: 'OLED vs QLED vs LED, 43" vs 55" vs 65" — our experts break down everything you need to know before renting or buying a TV.',
    category: 'Reviews',
    readTime: '7 min read',
    date: 'April 22, 2026',
    img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
  },
  {
    id: 5,
    title: 'Appliance Maintenance Tips to Extend Product Lifespan',
    excerpt: 'Whether you own or rent, proper care keeps your electronics running longer. Our technicians share their top maintenance advice.',
    category: 'Tips',
    readTime: '4 min read',
    date: 'April 5, 2026',
    img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
  },
  {
    id: 6,
    title: 'New in Town? Here\'s How to Furnish Your Home Without Breaking the Bank',
    excerpt: 'Just moved to a new city? Renting appliances is the smart move. Here\'s a complete checklist for setting up your home on a budget.',
    category: 'Lifestyle',
    readTime: '6 min read',
    date: 'March 18, 2026',
    img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
  },
];

const categories = ['All', 'Guides', 'Tips', 'Reviews', 'Lifestyle'];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = posts.find(p => p.featured);

  return (
    <div className="blog-page">
      {/* Hero */}
      <div className="blog-hero">
        <div className="container">
          <h1>Blog & Resources</h1>
          <p>Expert guides, tips, and news about electronics renting and buying</p>
          <div className="blog-search">
            <FaSearch className="blog-search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Post */}
        {featured && !searchQuery && activeCategory === 'All' && (
          <div className="featured-post">
            <div className="featured-img">
              <img src={featured.img} alt={featured.title} />
              <span className="featured-label">Featured</span>
            </div>
            <div className="featured-content">
              <span className="post-category">{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="post-meta">
                <span><FaClock size={12} /> {featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
              <button className="btn btn-primary">
                Read Article <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="blog-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`blog-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="blog-grid">
          {filtered.filter(p => !p.featured || searchQuery || activeCategory !== 'All').map(post => (
            <div key={post.id} className="blog-card">
              <div className="blog-card-img">
                <img src={post.img} alt={post.title} loading="lazy" />
                <span className="post-category">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <span><FaClock size={11} /> {post.readTime}</span>
                  <span>{post.date}</span>
                </div>
                <button className="read-more-btn">
                  Read More <FaArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>📝</div>
            <h3>No articles found</h3>
            <p>Try a different category or search term</p>
          </div>
        )}

        {/* Newsletter */}
        <div className="blog-newsletter">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get the latest tips, offers, and product news delivered to your inbox.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
