const SectionWrapper = ({ children, className = "" }) => (
  <section className={`max-w-7xl mx-auto px-4 md:px-8 py-12 ${className}`}>
    {children}
  </section>
);

export default SectionWrapper; 