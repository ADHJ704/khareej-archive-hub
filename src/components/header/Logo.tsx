
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <Book className="h-8 w-8 ml-2" />
      <Link to="/" className="font-heading text-2xl font-bold">أرشيف المشاريع</Link>
    </div>
  );
};

export default Logo;
