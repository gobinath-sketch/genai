import mammoth from 'mammoth';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import Tesseract from 'tesseract.js';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class FileProcessor {
  static async processFile(file: File): Promise<string> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // Enhanced file type detection
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return await this.processPDF(file);
    } else if (fileType.includes('word') || fileType.includes('document') || 
               fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return await this.processWord(file);
    } else if (fileType.startsWith('image/') || 
               fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
      return await this.processImage(file);
    } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
      return await this.processText(file);
    } else {
      // Try to process as text if other methods fail
      try {
        return await this.processText(file);
      } catch {
        throw new Error('Unsupported file format. Please upload PDF, Word document, image, or text file.');
      }
    }
  }

  private static async processPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        text += pageText + '\n';
      }

      if (!text.trim()) {
        throw new Error('No text found in PDF. Please ensure the PDF contains readable text.');
      }

      return text;
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to process PDF file. Please try again.');
    }
  }

  private static async processWord(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result.value.trim()) {
        throw new Error('No text found in Word document.');
      }
      
      return result.value;
    } catch (error) {
      console.error('Word processing error:', error);
      throw new Error('Failed to process Word document. Please try again.');
    }
  }

  private static async processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        if (!base64) {
          reject(new Error('Failed to read image file.'));
          return;
        }
        try {
          // Use Tesseract.js to extract text from the image
          const { data: { text } } = await Tesseract.recognize(base64, 'eng');
          if (!text || !text.trim()) {
            reject(new Error('No text found in image. Please upload a clearer image.'));
            return;
          }
          resolve(text);
        } catch (err) {
          reject(new Error('Failed to extract text from image.'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file.'));
      };
      reader.readAsDataURL(file);
    });
  }

  private static async processText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        if (!text || !text.trim()) {
          reject(new Error('No text found in file.'));
          return;
        }
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read text file.'));
      };
      reader.readAsText(file);
    });
  }
}