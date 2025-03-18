import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, X, RefreshCw, Bookmark, Share2 } from 'lucide-react';

// Map energy categories to their colors
const categoryColors = {
  solar: '#FFB800',
  hydro: '#2E90E5',
  wind: '#64748B',
  biomass: '#16A34A',
  geothermal: '#FF6B6B',
  general: '#6366F1'
};

// RSS feed URLs for renewable energy news
const RSS_FEEDS = [
  {
    url: 'https://www.renewableenergyworld.com/feed/',
    name: 'Renewable Energy World'
  },
  {
    url: 'https://cleantechnica.com/feed/',
    name: 'CleanTechnica'
  },
  {
    url: 'https://www.solarpowerworldonline.com/feed/',
    name: 'Solar Power World'
  }
];

// CORS proxy URL
const CORS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

const RenewableEnergyNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Check for cached articles first
    const cachedArticles = localStorage.getItem('renewable-news-cache');
    const cacheTimestamp = localStorage.getItem('renewable-news-timestamp');
    const now = new Date().getTime();
    
    if (cachedArticles && cacheTimestamp) {
      // Use cache if it's less than 3 hours old
      if (now - parseInt(cacheTimestamp) < 3 * 60 * 60 * 1000) {
        setArticles(JSON.parse(cachedArticles));
        setLastUpdated(new Date(parseInt(cacheTimestamp)));
        setLoading(false);
        console.log('Using cached news data');
        return;
      }
    }
    
    // Otherwise fetch fresh data
    fetchRenewableNews();
  }, []);

  const fetchRenewableNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let allArticles = [];
      
      // Try to fetch from each RSS feed
      const feedPromises = RSS_FEEDS.map(feed => 
        fetch(`${CORS_PROXY}${encodeURIComponent(feed.url)}`)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
              // Process the articles
              return data.items.map((item, index) => {
                // Clean up description (remove HTML)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.description;
                const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                
                // Determine category based on content
                const fullText = (item.title + ' ' + cleanDescription).toLowerCase();
                let category = 'general';
                
                if (fullText.includes('solar') || fullText.includes('photovoltaic') || fullText.includes('pv ')) {
                  category = 'solar';
                } else if (fullText.includes('wind') || fullText.includes('turbine')) {
                  category = 'wind';
                } else if (fullText.includes('hydro') || fullText.includes('hydroelectric') || 
                           fullText.includes('dam') || fullText.includes('water power')) {
                  category = 'hydro';
                } else if (fullText.includes('geothermal') || fullText.includes('heat pump')) {
                  category = 'geothermal';
                } else if (fullText.includes('biomass') || fullText.includes('biofuel') || 
                           fullText.includes('biogas')) {
                  category = 'biomass';
                }
                
                // Calculate read time (rough estimate based on word count)
                const wordCount = cleanDescription.split(/\s+/).length;
                const readTime = Math.max(1, Math.min(15, Math.ceil(wordCount / 200)));
                
                // Return formatted article
                return {
                  id: `${feed.name}-${index}`,
                  title: item.title,
                  description: cleanDescription.substring(0, 500) + (cleanDescription.length > 500 ? '...' : ''),
                  url: item.link,
                  urlToImage: item.enclosure?.link || item.thumbnail || getBestImage(item),
                  publishedAt: item.pubDate,
                  source: { name: feed.name },
                  category,
                  readTime
                };
              });
            }
            return [];
          })
          .catch(err => {
            console.warn(`Error fetching from ${feed.name}:`, err);
            return [];
          })
      );
      
      // Wait for all feed fetches to complete
      const feedResults = await Promise.all(feedPromises);
      
      // Combine all articles
      feedResults.forEach(articles => {
        if (articles && articles.length) {
          allArticles = [...allArticles, ...articles];
        }
      });
      
      // If we got articles
      if (allArticles.length > 0) {
        // Sort by date (newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Remove potential duplicates (simple title comparison)
        const uniqueArticles = [];
        const titleSet = new Set();
        
        allArticles.forEach(article => {
          if (!titleSet.has(article.title)) {
            titleSet.add(article.title);
            uniqueArticles.push(article);
          }
        });
        
        // Update state
        setArticles(uniqueArticles);
        
        // Save to cache
        const timestamp = new Date().getTime();
        localStorage.setItem('renewable-news-cache', JSON.stringify(uniqueArticles));
        localStorage.setItem('renewable-news-timestamp', timestamp.toString());
        setLastUpdated(new Date(timestamp));
      } else {
        throw new Error('No articles found from any source');
      }
    } catch (err) {
      console.error('Error fetching renewable energy news:', err);
      setError('Unable to load the latest renewable energy news. Please try again later.');
      
      // If we have no articles, use fallbacks
      if (articles.length === 0) {
        setArticles(getFallbackArticles());
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract the best image from an RSS item
  const getBestImage = (item) => {
    // Try common image locations in RSS items
    if (item.enclosure?.link) return item.enclosure.link;
    if (item.thumbnail) return item.thumbnail;
    
    // Try to find an image in the content
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) return imgMatch[1];
    }
    
    // Try to find an image in the description
    if (item.description) {
      const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) return imgMatch[1];
    }
    
    // Return a static generated color placeholder instead of via.placeholder.com
    const colors = ['F44336', '2196F3', '4CAF50', 'FFC107', '9C27B0', '3F51B5', '009688'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23${randomColor}'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3ERenewable Energy%3C/text%3E%3C/svg%3E`;
  };

  // Fallback articles for when all fetches fail
  const getFallbackArticles = () => {
    // Create colored SVG placeholders for fallback images
    const colorPlaceholders = [
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23FFB800'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3ESolar Energy%3C/text%3E%3C/svg%3E`,
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%232E90E5'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3EWind Energy%3C/text%3E%3C/svg%3E`,
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%2364748B'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3EHydropower%3C/text%3E%3C/svg%3E`,
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23FF6B6B'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3EGeothermal Energy%3C/text%3E%3C/svg%3E`,
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%2316A34A'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3EBiomass Energy%3C/text%3E%3C/svg%3E`
    ];
    
    return [
      {
        id: 'fallback-1',
        title: 'Solar Power Innovations Driving Renewable Energy Growth',
        description: 'New advances in solar panel efficiency and battery storage are accelerating the transition to clean energy worldwide. Researchers have developed panels that can operate at higher efficiency rates even in low-light conditions, potentially extending solar viability to more regions.',
        urlToImage: colorPlaceholders[0],
        publishedAt: new Date().toISOString(),
        source: { name: 'Renewable Energy World' },
        url: 'https://www.renewableenergyworld.com/',
        category: 'solar',
        readTime: 6
      },
      {
        id: 'fallback-2',
        title: 'Offshore Wind Projects Expand as Costs Decline',
        description: 'Offshore wind is seeing unprecedented growth as technology improvements drive down costs. New floating turbine designs allow wind farms to be installed in deeper waters, opening up vast new areas for renewable energy development without visual impact on coastal communities.',
        urlToImage: colorPlaceholders[1],
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: 'CleanTechnica' },
        url: 'https://cleantechnica.com/',
        category: 'wind',
        readTime: 5
      },
      {
        id: 'fallback-3',
        title: 'Hydropower Modernization Projects Boost Efficiency',
        description: 'Aging hydroelectric dams are getting high-tech upgrades that significantly increase their power output without increasing their environmental footprint. New turbine designs, digital controls, and improved flow management are breathing new life into infrastructure that in some cases is over 50 years old.',
        urlToImage: colorPlaceholders[2],
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: 'Hydro Review' },
        url: 'https://www.hydroreview.com/',
        category: 'hydro',
        readTime: 7
      },
      {
        id: 'fallback-4',
        title: 'Geothermal Power Plants Set for Major Expansion',
        description: 'Geothermal energy is experiencing renewed interest as countries look to develop always-on renewable energy sources. Enhanced geothermal systems now allow power production in regions previously thought unsuitable for geothermal development, potentially making this stable clean energy source widely available.',
        urlToImage: colorPlaceholders[3],
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: { name: 'Renewable Energy World' },
        url: 'https://www.renewableenergyworld.com/',
        category: 'geothermal',
        readTime: 8
      },
      {
        id: 'fallback-5',
        title: 'Biomass Industry Makes Progress on Sustainability Standards',
        description: 'The biomass industry is introducing new sustainability certifications to address concerns about feedstock sourcing. These standards ensure that biomass energy production does not compete with food production or contribute to deforestation, focusing instead on agricultural waste and sustainable forestry practices.',
        urlToImage: colorPlaceholders[4],
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        source: { name: 'Bioenergy Insight' },
        url: 'https://www.bioenergy-news.com/',
        category: 'biomass',
        readTime: 6
      }
    ];
  };

  // Filter articles based on active filter
  const filteredArticles = activeFilter === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  // Format time since publication
  const getTimeSince = (dateString) => {
    try {
      const now = new Date();
      const publishedDate = new Date(dateString);
      const diffInSeconds = Math.floor((now - publishedDate) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return formatDate(dateString);
    } catch (e) {
      return 'recently';
    }
  };

  // Open article in modal
  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  // Close article modal
  const closeArticleModal = () => {
    setModalOpen(false);
    // Add a small delay to avoid visual glitches
    setTimeout(() => setSelectedArticle(null), 300);
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchRenewableNews();
  };

  // Generate a random color placeholder SVG
  const generateColorPlaceholder = (text = 'Renewable Energy', colorHex = null) => {
    if (!colorHex) {
      const colors = ['F44336', '2196F3', '4CAF50', 'FFC107', '9C27B0', '3F51B5', '009688'];
      colorHex = colors[Math.floor(Math.random() * colors.length)];
    }
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23${colorHex}'/%3E%3Ctext x='400' y='200' font-family='Arial' font-size='32' text-anchor='middle' fill='white'%3E${text}%3C/text%3E%3C/svg%3E`;
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Renewable Energy News</h2>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-xs text-gray-500">
              Last updated: {getTimeSince(lastUpdated)}
              <button 
                onClick={handleManualRefresh}
                disabled={loading}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                title="Refresh now"
              >
                <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {['all', 'solar', 'wind', 'hydro', 'geothermal', 'biomass'].map(filter => (
              <button
                key={filter}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeFilter === filter 
                    ? `bg-gray-800 text-white` 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-lg overflow-hidden shadow-md bg-white">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No articles found for this category. Try selecting a different category or refreshing the news.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, 9).map(article => (
            <div 
              key={article.id}
              className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
              onClick={() => openArticleModal(article)}
            >
              <div className="h-40 bg-gray-200 relative">
                {article.urlToImage ? (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Use inline SVG data URL instead of external placeholder service
                      const categoryColors = {
                        solar: 'FFB800',
                        hydro: '2E90E5',
                        wind: '64748B',
                        biomass: '16A34A',
                        geothermal: 'FF6B6B',
                        general: '6366F1'
                      };
                      const colorHex = categoryColors[article.category] || '6366F1';
                      e.target.src = generateColorPlaceholder(article.category.charAt(0).toUpperCase() + article.category.slice(1) + ' Energy', colorHex);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">{article.source.name}</span>
                  </div>
                )}
                <div 
                  className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: categoryColors[article.category] || categoryColors.general }}
                >
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Clock size={12} className="mr-1" />
                  <span>{article.readTime} min read</span>
                  <span className="mx-2">•</span>
                  <span>{getTimeSince(article.publishedAt)}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{article.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">Source: {article.source.name}</span>
                  <span className="text-sm font-medium text-blue-600">Read more</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {modalOpen && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg truncate pr-4">{selectedArticle.title}</h3>
              <button 
                onClick={closeArticleModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow p-4">
              {selectedArticle.urlToImage && (
                <div className="mb-4">
                  <img 
                    src={selectedArticle.urlToImage} 
                    alt={selectedArticle.title} 
                    className="w-full h-auto max-h-[400px] object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      const categoryColors = {
                        solar: 'FFB800',
                        hydro: '2E90E5',
                        wind: '64748B',
                        biomass: '16A34A',
                        geothermal: 'FF6B6B',
                        general: '6366F1'
                      };
                      const colorHex = categoryColors[selectedArticle.category] || '6366F1';
                      e.target.src = generateColorPlaceholder(selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1) + ' Energy', colorHex);
                    }}
                  />
                </div>
              )}
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                <span className="font-medium">{selectedArticle.source.name}</span>
                <span>•</span>
                <Clock size={14} className="mx-1" />
                <span>{selectedArticle.readTime} min read</span>
                <span>•</span>
                <span>{formatDate(selectedArticle.publishedAt)}</span>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white ml-2"
                  style={{ backgroundColor: categoryColors[selectedArticle.category] || categoryColors.general }}
                >
                  {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
                </div>
              </div>
              
              <div className="mt-4 mb-6">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">{selectedArticle.description}</p>
              </div>
              
              <p className="text-gray-600 italic mb-4 border-t pt-4 text-sm">
                This is a preview. Visit the publisher's website to read the full article.
              </p>
            </div>
            
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100" title="Save article">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100" title="Share article">
                  <Share2 size={18} />
                </button>
              </div>
              
              <a 
                href={selectedArticle.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                Read Full Article <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      )}

      {articles.length > 9 && (
        <div className="text-center mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Load More News <RefreshCw size={16} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RenewableEnergyNews;