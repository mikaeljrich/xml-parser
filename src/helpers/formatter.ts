const validate = (input: string): void => {
  if (!input) {
    throw new Error('Input is empty');
  }

  input.split(/\n/).forEach((l) => {
    switch (l[0]) {
      case 'P':
      case 'T':
      case 'A':
      case 'F':
        break;
      default:
        throw new Error('Format of input is not correct.');
    }
  });
};

type FormatType = 'person' | 'family' | 'phone' | 'address';

const format = (input: string, type?: FormatType, indentation = 0): string => {
  const indent = new Array(indentation).fill('\t').join('');
  switch (type) {
    case 'person': {
      let person_xml = indent + '<person>\n';
      const [person, ...family] = input.split(/[F]\|/g);

      person_xml += person
        .split('\n')
        .filter((l) => l.length > 0)
        .reduce((acc, curr) => {
          switch (curr.slice(0, 2)) {
            case 'T|': {
              return acc + format(curr, 'phone', 2);
            }
            case 'A|': {
              return acc + format(curr, 'address', 2);
            }
            default: {
              const [fname, lname] = curr.split('|');
              return (acc += `${indent}\t<firstname>${fname}</firstname>\n${indent}\t<lastname>${lname}</lastname>\n`);
            }
          }
        }, '');

      const family_xml = family.reduce((acc, curr) => {
        return acc + format(curr, 'family');
      }, '');

      person_xml += `${family_xml}\t</person>\n`;

      return person_xml;
    }
    case 'family': {
      let family_xml = '\t\t<family>\n';
      family_xml += input
        .split('\n')
        .filter((l) => l.length > 0)
        .reduce((acc, curr) => {
          switch (curr.slice(0, 2)) {
            case 'T|': {
              return acc + format(curr, 'phone', 3);
            }
            case 'A|': {
              return acc + format(curr, 'address', 3);
            }
            default: {
              const [fname, birthyear] = curr.split('|');
              return (acc += `\t\t\t<name>${fname}</name>\n\t\t\t<born>${birthyear}</born>\n`);
            }
          }
        }, '');

      return family_xml;
    }
    case 'phone': {
      let phone = indent + '<phone>\n';
      const [_, mobile, fixed] = input.split('|');

      phone += mobile ? `${indent}\t<mobile>${mobile}</mobile>\n` : '';
      phone += fixed ? `${indent}\t<fixednumber>${fixed}</fixednumber>\n` : '';
      phone += indent + '</phone>\n';

      return phone;
    }
    case 'address': {
      let addr = indent + '<address>\n';
      const [_, street, city, postal_code] = input.split('|');

      addr += street ? `${indent}\t<street>${street}</street>\n` : '';
      addr += city ? `${indent}\t<city>${city}</city>\n` : '';
      addr += postal_code
        ? `${indent}\t<postalcode>${postal_code}</postalcode>\n`
        : '';
      addr += indent + '</address>\n';

      return addr;
    }
    default: {
      validate(input);
      const formatted = input.split(/[P]\|/g).reduce((acc, curr) => {
        acc += format(curr, 'person', 1);
        return acc;
      });
      return '<people>\n' + formatted + '</people>';
    }
  }
};

export default format;
