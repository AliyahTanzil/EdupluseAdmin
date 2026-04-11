/**
 * PerformanceSection Component
 * Renders COGNITIVE, AFFECTIVE, and PSYCHOMOTOR ratings
 * across all 3 terms in a grid layout
 */
import React from 'react';
import { RATING_LABELS } from '../../models/reportCardSchema';
import { ratingToLabel, ratingToColor } from '../../utils/reportCardUtils';

const RatingCell = ({ value }) => {
  const label = ratingToLabel(value);
  const color = ratingToColor(value);
  return (
    <td className={`rc-cell text-center font-semibold ${color}`}>
      {label}
    </td>
  );
};

const RatingSection = ({ title, icon, ratingData, labels, bgClass }) => {
  const keys = Object.keys(labels);

  return (
    <div className="mb-3">
      <div className={`flex items-center gap-2 px-3 py-1.5 ${bgClass} rounded-t-sm`}>
        <span className="text-sm">{icon}</span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
          {title}
        </h4>
      </div>
      <table className="w-full border-collapse text-xs rc-table">
        <thead>
          <tr className="bg-gray-100">
            <th className="rc-th text-left pl-3 w-40">Trait</th>
            <th className="rc-th text-center w-16">Term 1</th>
            <th className="rc-th text-center w-16">Term 2</th>
            <th className="rc-th text-center w-16">Term 3</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key} className="hover:bg-gray-50 transition-colors">
              <td className="rc-cell text-left pl-3 text-gray-700">{labels[key]}</td>
              <RatingCell value={ratingData?.[1]?.[key]} />
              <RatingCell value={ratingData?.[2]?.[key]} />
              <RatingCell value={ratingData?.[3]?.[key]} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PerformanceSection = ({ ratings }) => {
  return (
    <div className="border-t-2 border-gray-800 px-4 py-3">
      <h3 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-300 pb-1">
        📊 Performance Ratings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RatingSection
          title="Cognitive"
          icon="🧠"
          ratingData={ratings?.cognitive}
          labels={RATING_LABELS.cognitive}
          bgClass="bg-blue-100"
        />
        <RatingSection
          title="Affective"
          icon="💜"
          ratingData={ratings?.affective}
          labels={RATING_LABELS.affective}
          bgClass="bg-purple-100"
        />
        <RatingSection
          title="Psychomotor"
          icon="🏃"
          ratingData={ratings?.psychomotor}
          labels={RATING_LABELS.psychomotor}
          bgClass="bg-green-100"
        />
      </div>

      {/* Rating Scale Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-200 pt-2">
        <span className="font-semibold text-gray-600">Scale:</span>
        <span className="text-emerald-700 font-medium">A = Excellent</span>
        <span className="text-blue-700 font-medium">B = Very Good</span>
        <span className="text-yellow-700 font-medium">C = Good</span>
        <span className="text-orange-600 font-medium">D = Fair</span>
        <span className="text-red-600 font-medium">E = Poor</span>
      </div>
    </div>
  );
};

export default PerformanceSection;
