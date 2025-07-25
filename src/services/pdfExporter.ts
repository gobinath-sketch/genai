import { Question } from '../types';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import html2canvas from 'html2canvas';

export class PDFExporter {
  static async shareQuestionPaper(
    questions: Question[], 
    subject: string, 
    duration: number, 
    totalMarks: number
  ): Promise<void> {
    const content = this.generateContent(questions, subject, duration, totalMarks);
    
    if (navigator.share) {
      try {
        const blob = new Blob([content], { type: 'text/plain' });
        const file = new File([blob], `${subject}_question_paper.txt`, { type: 'text/plain' });
        
        await navigator.share({
          title: `${subject} - Question Paper`,
          text: `Generated question paper for ${subject}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to download if sharing fails
        this.generatePDF(questions, subject, duration, totalMarks);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      this.copyToClipboard(content, subject);
    }
  }

  static async copyToClipboard(content: string, subject: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.textContent = 'Question paper copied to clipboard!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      // Fallback to download
      this.generatePDF([], subject, 0, 0);
    }
  }

  static generatePDF(
    questions: Question[], 
    subject: string, 
    duration: number, 
    totalMarks: number
  ): void {
    try {
      const doc = new jsPDF();
      let y = 10;
      doc.setFontSize(16);
      doc.text(`${subject.toUpperCase()} - QUESTION PAPER`, 10, y);
      y += 8;
      doc.setFontSize(10);
      doc.text('='.repeat(50), 10, y);
      y += 8;
      doc.text(`Duration: ${duration} minutes`, 10, y);
      y += 6;
      doc.text(`Total Marks: ${totalMarks}`, 10, y);
      y += 6;
      doc.text(`Number of Questions: ${questions.length}`, 10, y);
      y += 8;
      doc.text('='.repeat(50), 10, y);
      y += 8;
      const hasSections = questions.some(q => q.section);
      if (hasSections) {
        const sectioned = Array.from(new Set(questions.map(q => q.section))).filter(Boolean);
        sectioned.forEach(section => {
          if (y > 270) { doc.addPage(); y = 10; }
          doc.setFontSize(13);
          doc.setFont('times', 'bold');
          doc.text(`Section ${section}`, 10, y);
          y += 8;
          doc.setFont('times', 'normal');
          doc.setFontSize(12);
          let sectionIndex = 1;
          questions.filter(q => q.section === section).forEach(question => {
            if (y > 270) { doc.addPage(); y = 10; }
            const qText = `${sectionIndex}. ${question.question}`;
            const lines = doc.splitTextToSize(qText, 160);
            doc.text(lines, 10, y);
            doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
            y += lines.length * 7 + 3;
            sectionIndex++;
          });
          y += 6;
        });
      } else {
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        questions.forEach((question, index) => {
          if (y > 270) { doc.addPage(); y = 10; }
          const qText = `${index + 1}. ${question.question}`;
          const lines = doc.splitTextToSize(qText, 160);
          doc.text(lines, 10, y);
          doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
          y += lines.length * 7 + 3;
        });
      }
      doc.save(`${subject}_question_paper.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateRealQuestionPaper(
    questions: Question[],
    subject: string,
    duration: number,
    totalMarks: number
  ): Promise<void> {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('GOVERNMENT OF INDIA', 105, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.text('CENTRAL BOARD OF SECONDARY EDUCATION', 105, y, { align: 'center' });
    y += 8;
    doc.text('ANNUAL EXAMINATION - 2024', 105, y, { align: 'center' });
    y += 8;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(`Subject: ${subject}`, 20, y);
    doc.text(`Time: ${duration} Minutes`, 150, y);
    y += 7;
    doc.text(`Maximum Marks: ${totalMarks}`, 20, y);
    y += 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('General Instructions:', 20, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text('1. All questions are compulsory.', 20, y); y += 6;
    doc.text('2. Answer the questions in the space provided.', 20, y); y += 6;
    doc.text('3. Write your answers clearly and legibly.', 20, y); y += 6;
    doc.text('4. For MCQs, select the correct option.', 20, y); y += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('---', 105, y, { align: 'center' });
    y += 8;
    const hasSections = questions.some(q => q.section);
    let sectioned = hasSections
      ? Array.from(new Set(questions.map(q => q.section))).filter(Boolean)
      : [];
    let qIndex = 1;
    const maxWidth = 160;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    if (hasSections) {
      sectioned.forEach(section => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(13);
        doc.setFont('times', 'bold');
        doc.text(`Section ${section}`, 20, y);
        y += 8;
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        let sectionIndex = 1;
        questions.filter(q => q.section === section).forEach(question => {
          if (y > 270) { doc.addPage(); y = 20; }
          const qText = `${sectionIndex}. ${question.question}`;
          const lines = doc.splitTextToSize(qText, maxWidth);
          doc.text(lines, 20, y);
          doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
          y += lines.length * 7 + 3;
          sectionIndex++;
        });
      });
    } else {
      questions.forEach((question, index) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const qText = `${index + 1}. ${question.question}`;
        const lines = doc.splitTextToSize(qText, maxWidth);
        doc.text(lines, 20, y);
        doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
        y += lines.length * 7 + 3;
      });
    }
    doc.save(`${subject}_real_question_paper.pdf`);
  }

  static async generateCollegeQuestionPaper(
    questions: Question[],
    subject: string,
    duration: number,
    totalMarks: number
  ): Promise<void> {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('ANNA UNIVERSITY, CHENNAI', 105, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.text('B.E./B.Tech. DEGREE EXAMINATIONS, APRIL/MAY 2024', 105, y, { align: 'center' });
    y += 8;
    doc.text('Regulation 2021', 105, y, { align: 'center' });
    y += 8;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(`Subject: ${subject}`, 20, y);
    doc.text(`Time: ${duration} Minutes`, 150, y);
    y += 7;
    doc.text(`Maximum Marks: ${totalMarks}`, 20, y);
    y += 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('Instructions:', 20, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text('1. Answer ALL questions in Part-A and Part-B.', 20, y); y += 6;
    doc.text('2. Use separate answer books for each part if instructed.', 20, y); y += 6;
    doc.text('3. Write your Register Number clearly.', 20, y); y += 6;
    doc.text('4. Assume suitable data if necessary and state it clearly.', 20, y); y += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('-----------------------------', 105, y, { align: 'center' });
    y += 8;
    const hasSections = questions.some(q => q.section);
    let sectioned = hasSections
      ? Array.from(new Set(questions.map(q => q.section))).filter(Boolean)
      : [];
    let qIndex = 1;
    const maxWidth = 160;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    if (hasSections) {
      sectioned.forEach(section => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(13);
        doc.setFont('times', 'bold');
        doc.text(`Section ${section}`, 20, y);
        y += 8;
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        let sectionIndex = 1;
        questions.filter(q => q.section === section).forEach(question => {
          if (y > 270) { doc.addPage(); y = 20; }
          const qText = `${sectionIndex}. ${question.question}`;
          const lines = doc.splitTextToSize(qText, maxWidth);
          doc.text(lines, 20, y);
          doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
          y += lines.length * 7 + 3;
          sectionIndex++;
        });
      });
    } else {
      questions.forEach((question, index) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const qText = `${index + 1}. ${question.question}`;
        const lines = doc.splitTextToSize(qText, maxWidth);
        doc.text(lines, 20, y);
        doc.text(`[${question.marks} marks]`, 200, y, { align: 'right' });
        y += lines.length * 7 + 3;
      });
    }
    doc.save(`${subject}_college_question_paper.pdf`);
  }

  static async generateDocx(
    questions: Question[],
    subject: string,
    duration: number,
    totalMarks: number
  ): Promise<void> {
    const hasSections = questions.some(q => q.section);
    let children: Paragraph[] = [
      new Paragraph({
        text: `${subject.toUpperCase()} - QUESTION PAPER`,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: '='.repeat(50),
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: `Duration: ${duration} minutes` }),
      new Paragraph({ text: `Total Marks: ${totalMarks}` }),
      new Paragraph({ text: `Number of Questions: ${questions.length}` }),
      new Paragraph({ text: '' }),
      new Paragraph({ text: '='.repeat(50) }),
      new Paragraph({ text: '' }),
    ];
    if (hasSections) {
      const sectioned = Array.from(new Set(questions.map(q => q.section))).filter(Boolean);
      sectioned.forEach(section => {
        children.push(new Paragraph({
          text: `Section ${section}`,
          heading: HeadingLevel.HEADING_2,
        }));
        let sectionIndex = 1;
        questions.filter(q => q.section === section).forEach(question => {
          children.push(new Paragraph({
            children: [
              new TextRun({
                text: `${sectionIndex}. ${question.question}`,
                bold: true,
              }),
              new TextRun({
                text: `   [${question.marks} mark${question.marks !== 1 ? 's' : ''}]`,
                bold: false,
              }),
            ],
          }));
          sectionIndex++;
        });
        children.push(new Paragraph({ text: '' }));
      });
    } else {
      questions.forEach((question, index) => {
        children.push(new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${question.question}`,
              bold: true,
            }),
            new TextRun({
              text: `   [${question.marks} mark${question.marks !== 1 ? 's' : ''}]`,
              bold: false,
            }),
          ],
        }));
      });
    }
    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subject}_question_paper.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async generateImage(
    questions: Question[],
    subject: string,
    duration: number,
    totalMarks: number
  ): Promise<void> {
    const doc = new jsPDF({ unit: 'px', format: 'a4' });
    let y = 30;
    doc.setFontSize(18);
    doc.text(`${subject.toUpperCase()} - QUESTION PAPER`, 40, y);
    y += 18;
    doc.setFontSize(11);
    doc.text('='.repeat(50), 40, y);
    y += 14;
    doc.text(`Duration: ${duration} minutes`, 40, y);
    y += 12;
    doc.text(`Total Marks: ${totalMarks}`, 40, y);
    y += 12;
    doc.text(`Number of Questions: ${questions.length}`, 40, y);
    y += 16;
    doc.setFontSize(13);
    questions.forEach((question, index) => {
      if (y > 750) { doc.addPage(); y = 30; }
      const qText = `${index + 1}. ${question.question}`;
      const lines = doc.splitTextToSize(qText, 400);
      doc.text(lines, 40, y);
      doc.text(`${question.marks} marks`, 500, y, { align: 'right' });
      y += lines.length * 16 + 8;
    });
    // Export as PNG
    const imgData = doc.output('dataurlstring');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${subject}_question_paper.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static async exportQuestionPaperAsPng(domSelector: string, filename: string = 'question_paper.png') {
    const node = document.querySelector(domSelector) as HTMLElement;
    if (!node) return;
    const canvas = await html2canvas(node, { backgroundColor: '#fff', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static generateContent(
    questions: Question[], 
    subject: string, 
    duration: number, 
    totalMarks: number
  ): string {
    let content = `${subject.toUpperCase()} - QUESTION PAPER\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `Duration: ${duration} minutes\n`;
    content += `Total Marks: ${totalMarks}\n`;
    content += `Number of Questions: ${questions.length}\n\n`;
    
    content += `INSTRUCTIONS:\n`;
    content += `• Read all questions carefully before answering\n`;
    content += `• Answer all questions within the given time limit\n`;
    content += `• For multiple choice questions, select the best answer\n`;
    content += `• Write clearly and legibly for written answers\n\n`;
    
    content += `${'='.repeat(50)}\n\n`;

    questions.forEach((question, index) => {
      content += `${index + 1}. ${question.question}\n`;
      content += `   [${question.marks} mark${question.marks !== 1 ? 's' : ''}] - ${question.difficulty} - ${question.topic}\n`;
      
      if (question.type === 'multiple-choice' && question.options) {
        question.options.forEach((option, optionIndex) => {
          content += `   ${String.fromCharCode(65 + optionIndex)}. ${option}\n`;
        });
      }
      
      if (question.type === 'true-false') {
        content += `   A. True\n   B. False\n`;
      }
      
      if (question.type === 'short-answer' || question.type === 'long-answer') {
        content += `   Answer: ________________________________\n`;
        if (question.type === 'long-answer') {
          content += `   _______________________________________\n`;
          content += `   _______________________________________\n`;
        }
      }
      
      content += `\n`;
    });

    return content;
  }
}