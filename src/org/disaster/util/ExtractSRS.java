package org.disaster.util;

import java.io.File;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Pure Java utility to extract text content from .docx documents (ZIP + XML parsing)
 * Fully replaces the previous Python extraction script (extract_srs.py).
 */
public class ExtractSRS {

    public static String extractDocxText(File docxFile) throws Exception {
        if (!docxFile.exists()) {
            throw new IllegalArgumentException("DOCX file not found: " + docxFile.getAbsolutePath());
        }

        StringBuilder extractedText = new StringBuilder();
        try (ZipFile zipFile = new ZipFile(docxFile)) {
            ZipEntry documentXmlEntry = zipFile.getEntry("word/document.xml");
            if (documentXmlEntry == null) {
                throw new IllegalStateException("Invalid DOCX format: word/document.xml not found");
            }

            try (InputStream is = zipFile.getInputStream(documentXmlEntry)) {
                DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
                dbFactory.setNamespaceAware(true);
                // Secure XML parser configuration
                dbFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
                Document doc = dBuilder.parse(is);
                doc.getDocumentElement().normalize();

                NodeList paragraphs = doc.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "p");
                for (int i = 0; i < paragraphs.getLength(); i++) {
                    Element pElem = (Element) paragraphs.item(i);
                    NodeList textNodes = pElem.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "t");
                    StringBuilder pBuilder = new StringBuilder();
                    for (int j = 0; j < textNodes.getLength(); j++) {
                        Node tNode = textNodes.item(j);
                        if (tNode != null && tNode.getTextContent() != null) {
                            pBuilder.append(tNode.getTextContent());
                        }
                    }
                    String pText = pBuilder.toString().trim();
                    if (!pText.isEmpty()) {
                        extractedText.append(pText).append("\n");
                    }
                }
            }
        }
        return extractedText.toString();
    }

    public static void main(String[] args) {
        String docxPath = args.length > 0 ? args[0] : "SRS_Disaster_Preparedness.docx";
        String outputPath = args.length > 1 ? args[1] : "srs_extracted.txt";

        System.out.println("ExtractSRS (Java 26): Extracting text from " + docxPath + "...");
        try {
            File docx = new File(docxPath);
            String text = extractDocxText(docx);
            try (PrintWriter out = new PrintWriter(outputPath, StandardCharsets.UTF_8)) {
                out.print(text);
            }
            System.out.println("Successfully extracted " + text.length() + " characters to " + outputPath);
        } catch (Exception e) {
            System.err.println("Error extracting DOCX: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
