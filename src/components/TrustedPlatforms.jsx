import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Shield } from 'lucide-react';
import { TRUSTED_PLATFORMS } from '../utils/constants';

const TrustedPlatforms = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Trusted Platforms in India</h2>
          <p className="text-sm text-gray-500">Best exchanges to buy & trade crypto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRUSTED_PLATFORMS.map((platform, index) => (
          <motion.a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)' }}
            className="glass-panel p-6 text-center group cursor-pointer"
          >
            <div className="text-4xl mb-3">{platform.logo}</div>
            <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-linear-accent-light transition-colors">
              {platform.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{platform.description}</p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-2 px-4 rounded-lg bg-gradient-to-r ${platform.color} text-white font-medium inline-flex items-center space-x-2`}
            >
              <span>Trade Now</span>
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </motion.a>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="glass-panel p-4 mt-6 border-yellow-500/30">
        <p className="text-xs text-gray-400 text-center">
          ⚠️ <span className="font-semibold">Disclaimer:</span> Cryptocurrency investments carry risk. 
          Always do your own research and invest responsibly. These platforms are suggestions only.
        </p>
      </div>
    </motion.section>
  );
};

export default TrustedPlatforms;
