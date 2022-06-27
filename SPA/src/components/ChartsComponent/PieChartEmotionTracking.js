import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartEmotionTracking = ({ countPositive = 0, countNeutral = 0, countNegative = 0 }) => {
  const data = {
    labels: ['negative', 'neutral', 'positive'],
    datasets: [
      {
        label: '# of Votes',
        data: [countNegative, countNeutral, countPositive],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }}/>
  );
}

PieChartEmotionTracking.propTypes = {
  countPositive: PropTypes.number,
  countNeutral: PropTypes.number,
  countNegative: PropTypes.number
};

export default PieChartEmotionTracking;
