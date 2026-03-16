import { jsPDF } from 'jspdf';
import { DictationResult } from './gemini';

export const exportToPDF = (dictation: DictationResult, isPro: boolean = false) => {
  if (!dictation) {
    alert('No hay ningún dictado disponible para exportar.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 25;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);
  const bottomLimit = 275;

  const ensureSpace = (currentY: number, needed: number, resetY: number = 25) => {
    if (currentY + needed > bottomLimit) {
      doc.addPage();
      return resetY;
    }
    return currentY;
  };

  const addWrappedText = (
    text: string,
    fontSize: number,
    isBold: boolean = false,
    color: [number, number, number] = [0, 0, 0],
    lineHeight: number = 1.2,
    align: 'left' | 'center' | 'right' | 'justify' = 'left',
    currentY: number
  ): number => {
    if (!text) return currentY;

    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, contentWidth);
    const step = fontSize * (lineHeight / 2.83);

    lines.forEach((line: string) => {
      currentY = ensureSpace(currentY, step);
      doc.text(line, margin, currentY, {
        align: align === 'justify' ? 'justify' : align,
        maxWidth: contentWidth
      });
      currentY += step;
    });

    return currentY + 4;
  };

  const addFooter = (pageNum: number) => {
    if (!isPro) {
      doc.setPage(pageNum);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Creado con DictadoLab', pageWidth / 2, 287, { align: 'center' });
    }
  };

  const parseWordsFromText = (text: string): string[] => {
    if (!text) return [];

    let cleaned = text.trim();

    const colonIndex = cleaned.indexOf(':');
    if (colonIndex !== -1) {
      cleaned = cleaned.slice(colonIndex + 1).trim();
    }

    return cleaned
      .split(/\n|[,;]|\s{2,}/)
      .map(w => w.trim())
      .filter(Boolean);
  };

  const drawWordsInColumns = (
    words: string[],
    startY: number,
    cols: number = 2,
    fontSize: number = 12,
    rowGap: number = 8,
    color: [number, number, number] = [51, 65, 85]
  ): number => {
    if (!words.length) return startY;

    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color[0], color[1], color[2]);

    const gap = 8;
    const colWidth = (contentWidth - gap * (cols - 1)) / cols;
    const rows = Math.ceil(words.length / cols);

    let y = startY;

    for (let row = 0; row < rows; row++) {
      y = ensureSpace(y, rowGap + 2);

      for (let col = 0; col < cols; col++) {
        const index = row + col * rows;
        if (index < words.length) {
          const x = margin + col * (colWidth + gap);
          const word = words[index].replace(/_/g, '__');
          doc.text(word, x, y, { maxWidth: colWidth - 2 });
        }
      }

      y += rowGap;
    }

    return y + 3;
  };

  const drawStudentWritingLines = (startY: number, numLines: number) => {
    let y = startY;
    doc.setDrawColor(203, 213, 225);

    for (let i = 0; i < numLines; i++) {
      if (y > 270) break;
      doc.line(margin, y, pageWidth - margin, y);
      y += 11;
    }

    return y;
  };

  const looksLikeWordList = (text: string): boolean => {
    if (!text) return false;

    const lines = text.split('\n').map(t => t.trim()).filter(Boolean);
    if (lines.length >= 4) return true;

    const commas = (text.match(/,/g) || []).length;
    if (commas >= 4) return true;

    return false;
  };

  const parseFinalActivityItems = (text: string): string[] => {
    if (!text) return [];

    if (looksLikeWordList(text)) {
      return text
        .split(/\n|,/)
        .map(t => t.trim())
        .filter(Boolean);
    }

    return [];
  };

  // --- PÁGINA 1: HOJA DEL PROFESOR ---
  let yPos = 30;

  yPos = addWrappedText(
    dictation.title || 'Dictado sin título',
    24,
    true,
    [15, 23, 42],
    1.1,
    'left',
    yPos
  );
  yPos += 1;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Regla: ${dictation.rule}  |  Nivel: ${dictation.difficulty.charAt(0).toUpperCase() + dictation.difficulty.slice(1)}`,
    margin,
    yPos
  );
  yPos += 8;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;

  yPos = addWrappedText('DICTADO', 10, true, [79, 70, 229], 1.2, 'left', yPos);
  yPos = addWrappedText(dictation.content, 13, false, [30, 41, 59], 1.5, 'justify', yPos);
  yPos += 4;

  yPos = ensureSpace(yPos, 25);
  yPos = addWrappedText('EJERCICIO PREVIO RESUELTO', 10, true, [79, 70, 229], 1.2, 'left', yPos);

  if (dictation.keywords && dictation.keywords.length > 0) {
    const cols = dictation.keywords.length >= 10 ? 3 : 2;
    yPos = drawWordsInColumns(dictation.keywords, yPos, cols, 12, 8);
  } else {
    yPos = addWrappedText('No hay palabras clave disponibles.', 11, false, [100, 116, 139], 1.2, 'left', yPos);
  }

  if (dictation.finalActivity) {
    yPos = ensureSpace(yPos, 30);
    yPos = addWrappedText(
      dictation.finalActivity.title?.toUpperCase() || 'ACTIVIDAD FINAL',
      10,
      true,
      [79, 70, 229],
      1.2,
      'left',
      yPos
    );
    yPos = addWrappedText(dictation.finalActivity.instruction || '', 11, true, [30, 41, 59], 1.2, 'left', yPos);

    const finalItemsTeacher = parseFinalActivityItems(dictation.finalActivity.content || '');

    if (finalItemsTeacher.length >= 6) {
      const cols = finalItemsTeacher.length >= 12 ? 3 : 2;
      yPos = drawWordsInColumns(finalItemsTeacher, yPos, cols, 11, 7);
    } else {
      yPos = addWrappedText(dictation.finalActivity.content || '', 11, false, [51, 65, 85], 1.3, 'left', yPos);
    }
  }

  addFooter(1);

  // --- PÁGINA 2: HOJA DEL ALUMNO ---
  doc.addPage();
  yPos = 25;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const colName = margin;
  const colCourse = margin + (contentWidth * 0.65);
  const colDate = margin + (contentWidth * 0.80);

  doc.text('Nombre: ____________________________________________________', colName, yPos);
  doc.text('Curso: ___________', colCourse, yPos);
  doc.text('Fecha: ___________', colDate, yPos);
  yPos += 12;

  doc.setFont('helvetica', 'bold');
  doc.text(`Regla ortográfica: ${dictation.rule}`, margin, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.text('Título: ____________________________________', margin, yPos);
  yPos += 14;

  if (dictation.preExercise) {
    yPos = ensureSpace(yPos, 40);
    yPos = addWrappedText('EJERCICIO PREVIO', 10, true, [79, 70, 229], 1.2, 'left', yPos);
    yPos = addWrappedText(
      'Completa las siguientes palabras aplicando la regla ortográfica trabajada:',
      11,
      false,
      [30, 41, 59],
      1.2,
      'left',
      yPos
    );

    const exerciseWords = parseWordsFromText(dictation.preExercise);
    const displayWords = exerciseWords.length > 0 ? exerciseWords : [dictation.preExercise];

    const cols = displayWords.length >= 10 ? 3 : 2;
    yPos = drawWordsInColumns(displayWords, yPos, cols, 12, 9);
    yPos += 2;
  }

  yPos = ensureSpace(yPos, 80);
  yPos = addWrappedText('DICTADO', 10, true, [79, 70, 229], 1.2, 'left', yPos);

  let numLines = 10;
  if (dictation.finalActivity) {
    numLines = 7;
  }

  yPos = drawStudentWritingLines(yPos + 2, numLines);

  if (dictation.finalActivity) {
    yPos += 3;
    yPos = ensureSpace(yPos, 35);

    yPos = addWrappedText(
      dictation.finalActivity.title?.toUpperCase() || 'ACTIVIDAD FINAL',
      10,
      true,
      [79, 70, 229],
      1.2,
      'left',
      yPos
    );
    yPos = addWrappedText(
      dictation.finalActivity.instruction || '',
      11,
      true,
      [30, 41, 59],
      1.2,
      'left',
      yPos
    );

    const finalItemsStudent = parseFinalActivityItems(dictation.finalActivity.content || '');

    if (finalItemsStudent.length >= 6) {
      const cols = finalItemsStudent.length >= 12 ? 3 : 2;
      yPos = drawWordsInColumns(finalItemsStudent, yPos, cols, 11, 8);
    } else {
      yPos = addWrappedText(dictation.finalActivity.content || '', 11, false, [51, 65, 85], 1.3, 'left', yPos);
    }
  }

  addFooter(2);

  // --- PÁGINA 3: ADAPTACIÓN PT (Opcional) ---
  if (dictation.ptAdaptation) {
    doc.addPage();
    yPos = 30;

    yPos = addWrappedText(dictation.ptAdaptation.title, 20, true, [15, 23, 42], 1.1, 'left', yPos);
    yPos += 3;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);

    dictation.ptAdaptation.instructions.forEach(inst => {
      yPos = addWrappedText(inst, 11, false, [30, 41, 59], 1.2, 'left', yPos);
    });

    yPos += 6;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    dictation.ptAdaptation.sentences.forEach(sentence => {
      yPos = addWrappedText(sentence, 14, false, [51, 65, 85], 1.7, 'left', yPos);
      yPos += 2;
    });

    yPos += 6;
    yPos = addWrappedText(dictation.ptAdaptation.hint, 11, true, [79, 70, 229], 1.2, 'left', yPos);

    addFooter(3);
  }

  // --- PÁGINA 4: ADAPTACIÓN AL (Opcional) ---
  if (dictation.alAdaptation) {
    doc.addPage();
    yPos = 30;

    yPos = addWrappedText(dictation.alAdaptation.title, 20, true, [15, 23, 42], 1.1, 'left', yPos);
    yPos += 3;

    yPos = addWrappedText(dictation.alAdaptation.instructions, 11, false, [30, 41, 59], 1.2, 'left', yPos);
    yPos += 6;

    const words = dictation.alAdaptation.words || [];
    const cols = words.length >= 10 ? 3 : 2;
    yPos = drawWordsInColumns(words, yPos, cols, 14, 10);

    addFooter(doc.internal.pages.length - 1);
  }

  const safeTitle = (dictation.title || 'dictado')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  doc.save(`dictadolab-${safeTitle}.pdf`);
};