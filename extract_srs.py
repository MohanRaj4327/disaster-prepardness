import zipfile
import xml.etree.ElementTree as ET

def extract_docx_text(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        # Word XML namespaces
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)

if __name__ == '__main__':
    text = extract_docx_text('SRS_Disaster_Preparedness.docx')
    with open('srs_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extracted", len(text), "chars")
