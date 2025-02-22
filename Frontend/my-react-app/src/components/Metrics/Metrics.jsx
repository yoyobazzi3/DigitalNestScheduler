import React from 'react';
import './Metrics.css';

const Metrics = () => {
  return (
    <div className="graph-container">
      <div className="row top-row">
        <div className="rectangle rectangle-small">
          <div className="project-summaries">
            {/* Project summaries graphic */}
          </div>
        </div>
        <div className="rectangle rectangle-large">
          <div className="monthly-growth">
            {/* Monthly growth graph */}
          </div>
        </div>
      </div>
      <div className="row bottom-row">
        <div className="rectangle rectangle-third">
          <div className="department-growth">
            {/* Department growth graph */}
          </div>
        </div>
        <div className="rectangle rectangle-third">
          <div className="project-workloads">
            {/* Project workloads graph */}
          </div>
        </div>
        <div className="rectangle rectangle-third">
          <div className="overall-growth">
            {/* Overall growth graph */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;