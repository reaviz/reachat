import { FC, useEffect, useState, ReactElement, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCSV } from '@/utils/parseCSV';
import DownloadIcon from '@/assets/download.svg?react';
import PlaceholderIcon from '@/assets/copy.svg?react';

interface CSVFileRendererProps {
  name?: string;
  url: string;
  fileIcon?: ReactElement;
}

/**
 * Renderer for CSV files that fetches and displays a snippet of the file data.
 */
const CSVFileRenderer: FC<CSVFileRendererProps> = ({ name, url, fileIcon }) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const data = parseCSV();
        setCsvData(data);
      } catch {
        setError('Failed to load CSV file.');
      }
    };

    fetchCsvData();
  }, [url]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const downloadCSV = () => {
    if (csvData.length === 0) return;

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name || 'data'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = (data: string[][], maxRows?: number) => (
    <motion.table
      layout
      className="w-full"
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10">
        <tr>
          <th className="py-4 px-6">#</th>
          {data[0].map((header, index) => (
            <th key={`header-${index}`} className="py-4 px-6">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1, maxRows).map((row, rowIndex) => (
          <tr
            key={`row-${rowIndex}`}
            className="border-b border-panel-accent hover:bg-panel-accent/40 transition-colors text-base text-text-secondary"
          >
            <td className="py-4 px-6">{rowIndex + 1}</td>
            {row.map((cell, cellIndex) => (
              <td
                key={`cell-${rowIndex}-${cellIndex}`}
                className="py-4 px-6 dark:bg-vulcan light:bg-mystic"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </motion.table>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="csv-icon flex items-center gap-2">
          {fileIcon}
          {name && <figcaption className="file-name">{name}</figcaption>}
        </div>
        <div className="csv-icon flex items-center gap-6">
          <DownloadIcon onClick={downloadCSV} className="cursor-pointer" />
          <PlaceholderIcon onClick={toggleModal} className="cursor-pointer" />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="flex justify-between">
        {!error && csvData.length > 0 && renderTable(csvData, 6)}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white dark:bg-gray-900 rounded-md w-11/12 h-5/6 overflow-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {!error && csvData.length > 0 && renderTable(csvData)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CSVFileRenderer;
