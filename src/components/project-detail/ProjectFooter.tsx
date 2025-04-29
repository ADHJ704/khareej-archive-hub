
import React from 'react';

const ProjectFooter = () => {
  return (
    <footer className="bg-archive-dark text-white py-6">
      <div className="container-custom text-center">
        <p>أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default ProjectFooter;
