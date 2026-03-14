import React, { useState } from 'react';
import './StaggeredMenu.css';

const StaggeredMenu = ({
  position = 'right',
  isFixed = false,
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  accentColor = '#ccff00',
  menuButtonColor = '#ffffff',
  openMenuButtonColor = '#ccff00',
  colors = ['#111111', '#0A0A0A'],
  logoUrl = '',
  isOpen: controlledIsOpen,
  onToggle
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalOpen;

  const toggleMenu = () => {
    const next = !isOpen;
    if (onToggle) onToggle(next);
    if (controlledIsOpen === undefined) setInternalOpen(next);
  };

  return (
    <div className={`staggered-menu-wrapper ${isFixed ? 'fixed-wrapper' : ''}`} data-position={position}>
      {/* Header */}
      <header className="staggered-menu-header">
        {/* Menu Toggle Button */}
        <button
          className="sm-toggle"
          onClick={toggleMenu}
          style={{
            color: isOpen ? openMenuButtonColor : menuButtonColor,
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isOpen ? 'Close' : 'Menu'}
          </span>
          <div className="sm-icon">
            <span className="sm-icon-line" style={{
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              top: isOpen ? '50%' : '35%'
            }}></span>
            <span className="sm-icon-line" style={{
              transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              top: isOpen ? '50%' : '65%'
            }}></span>
          </div>
        </button>
      </header>

      {/* Prelayers */}
      <div className="sm-prelayers">
        {colors.map((color, index) => (
          <div
            key={index}
            className="sm-prelayer"
            style={{
              backgroundColor: color,
              transform: isOpen ? `translateX(${(index + 1) * 5}%)` : 'translateX(0%)',
              transition: 'transform 0.8s ease'
            }}
          />
        ))}
      </div>

      {/* Panel */}
      <div
        className="staggered-menu-panel"
        style={{
          transform: isOpen ? 'translateX(0%)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
          transition: 'transform 0.8s ease'
        }}
      >
        <div className="sm-panel-inner">
          {/* Navigation Links */}
          <ul className="sm-panel-list" data-numbering={displayItemNumbering}>
            {items.map((item, index) => (
              <li key={index} className="sm-panel-itemWrap">
                <a
                  href={item.link}
                  className="sm-panel-item"
                  aria-label={item.ariaLabel}
                  style={{
                    '--sm-accent': accentColor,
                    transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
                    opacity: isOpen ? 1 : 0,
                    transition: `transform 0.6s ease ${0.2 + index * 0.1}s, opacity 0.6s ease ${0.2 + index * 0.1}s`
                  }}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Social Links */}
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials">
              <h3 className="sm-socials-title">Resources</h3>
              <ul className="sm-socials-list">
                {socialItems.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.link}
                      className="sm-socials-link"
                      style={{ '--sm-accent': accentColor }}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaggeredMenu;