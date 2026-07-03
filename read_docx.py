import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            
            # The namespaces in docx
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Extract all text from paragraphs
            text = []
            for paragraph in tree.findall('.//w:p', namespaces):
                para_text = []
                for run in paragraph.findall('.//w:r', namespaces):
                    text_node = run.find('w:t', namespaces)
                    if text_node is not None and text_node.text:
                        para_text.append(text_node.text)
                text.append(''.join(para_text))
                
            return '\n'.join(text)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    with open('plan.txt', 'w', encoding='utf-8') as f:
        f.write(read_docx(sys.argv[1]))
