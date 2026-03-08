import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-block">
      <h2 className="text-3xl text-blue-700 font-extrabold font-serif">
        <span className="underline underline-offset-4 decoration-blue-600">{text1}</span> {text2}
      </h2>
    </div>
  );
};

export default Title;
