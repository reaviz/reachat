import { AnimatePresence, motion } from 'motion/react';
import { IconButton } from 'reablocks';
import type { FC, ReactElement } from 'react';
import { useContext, useEffect, useRef, useState } from 'react';

import PlaceholderIcon from '@/assets/copy.svg?react';
import DownloadIcon from '@/assets/download.svg?react';
import { parseCSV } from '@/utils/parseCSV';
import { ChatContext } from '@/ChatContext';

interface CSVFileRendererProps {
  /**
   * Name of the file.
   */
  name?: string;

  /**
   * URL of the file.
   */
  url: string;

  /**
   * Icon to for file type.
   */
  fileIcon?: ReactElement;
}

/**
 * Renderer for CSV files that fetches and displays a snippet of the file data.
 */
const CSVFileRenderer: FC<CSVFileRendererProps> = ({ name, url, fileIcon }) => {
  const { theme } = useContext(ChatContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        const data = parseCSV(await response.text());
        setCsvData(data);
      } catch {
        setError('Failed to load CSV file.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCsvData();
  }, [url]);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
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

    const csvContent = csvData.map(row => row.join(',')).join('\n');
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
            className="border-b border-panel-accent light:border-gray-700 hover:bg-panel-accent hover:light:bg-gray-700/40 transition-colors text-base"
          >
            <td className="py-4 px-6">{rowIndex + 1}</td>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${rowIndex}-${cellIndex}`} className="py-4 px-6">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </motion.table>
  );

  return (
    <div className={theme.messages.message.csvPreview.base}>
      <div className={theme.messages.message.csvPreview.header.base}>
        <div className={theme.messages.message.csvPreview.header.icon}>
          {fileIcon}
          {name && <figcaption className="ml-1">{name}</figcaption>}
        </div>
        <div className={theme.messages.message.csvPreview.header.actions}>
          <IconButton size="medium" variant="text" onClick={downloadCSV}>
            <DownloadIcon />
          </IconButton>
          <IconButton size="medium" variant="text" onClick={toggleModal}>
            <PlaceholderIcon />
          </IconButton>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading && !csvData && (
        <div className="text-text-secondary">Loading...</div>
      )}

      <div className={theme.messages.message.csvPreview.tableContainer}>
        {!error && csvData.length > 0 && renderTable(csvData, 6)}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={theme.messages.message.csvPreview.dialog.base}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className={theme.messages.message.csvPreview.dialog.container}
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
