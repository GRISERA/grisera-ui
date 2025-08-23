/**
 * Pobiera plik z podanego URL i inicjuje jego pobranie przez przeglądarkę.
 *
 * @param {string} url Adres URL pliku do pobrania.
 * @param {string} [filename] Opcjonalna nazwa pliku, pod jaką ma być zapisany.
 *                             Jeśli nie zostanie podana, funkcja spróbuje ją wywnioskować z URL
 *                             lub nagłówka Content-Disposition, a w ostateczności użyje 'downloaded-file'.
 * @returns {Promise<Blob | null>} Obietnica, która rozwiązuje się do obiektu Blob reprezentującego
 *                                 pobrany plik, lub null w przypadku błędu.
 *                                 Pobieranie pliku przez przeglądarkę jest efektem ubocznym.
 */

export async function downloadFileFromUrl(url, filename) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${ response.status } ${ response.statusText }`);
    }

    const blob = await response.blob();

    // Spróbuj ustalić nazwę pliku, jeśli nie została podana
    if (!filename) {
      // 1. Sprawdź nagłówek Content-Disposition
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.includes('attachment')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // 2. Jeśli nie ma w nagłówku, spróbuj z URL
      if (!filename) {
        try {
          const urlPath = new URL(url).pathname;
          filename = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        } catch (e) {
          // Ignoruj błąd parsowania URL, jeśli np. jest względny
          // i nie ma bazy, lub jest niepoprawny.
        }
      }

      // 3. Domyślna nazwa, jeśli żadna z powyższych metod nie zadziałała
      if (!filename) {
        filename = 'downloaded-file';
      }
    }

    // Utwórz tymczasowy URL dla obiektu Blob
    const objectUrl = URL.createObjectURL(blob);

    // Utwórz tymczasowy element <a> do zainicjowania pobierania
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename; // Tutaj ustawiamy nazwę pliku

    // Dodaj element do DOM (ważne dla Firefox), kliknij i usuń
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Zwolnij tymczasowy URL obiektu
    URL.revokeObjectURL(objectUrl);

    console.log(`Plik "${ filename }" zainicjowano pobieranie.`);
    return blob; // Zwracamy Blob, jeśli chcemy z nim coś jeszcze zrobić

  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania pliku:', error);
    // W zależności od potrzeb, można tutaj rzucić błąd dalej lub zwrócić null/false
    return null;
  }
}

// --- Przykład użycia ---

// Aby to przetestować, potrzebujesz działającego linku do pliku TXT lub CSV.
// Możesz np. umieścić plik 'test.txt' na swoim lokalnym serwerze deweloperskim.
// Albo użyć publicznego linku do pliku, np. z GitHub Gist.

// Przykład z publicznym plikiem CSV (upewnij się, że serwer pozwala na CORS)
// const exampleUrlCsv =
// 'https://gist.githubusercontent.com/Birssan/fc40a916f884597915e6660d26978813/raw/9df97723e4e59e2a9d1f9510397c3e9998d9895d/sample.csv';
// downloadFileFromUrl(exampleUrlCsv, 'przykladowy.csv');

// Przykład z publicznym plikiem TXT
// const exampleUrlTxt = 'https://www.w3.org/TR/2003/REC-PNG-20031110/iso_8859-1.txt';
// downloadFileFromUrl(exampleUrlTxt, 'plik_tekstowy.txt');

// Przykład z próbą automatycznego wykrycia nazwy pliku
// downloadFileFromUrl(exampleUrlTxt);


// Aby uruchomić przykład:
// 1. Skopiuj ten kod do pliku HTML w tagu <script> lub do pliku .js dołączonego do HTML.
// 2. Otwórz plik HTML w przeglądarce.
// 3. Odkomentuj jeden z przykładów wywołania funkcji i podaj działający URL.
// (Możesz też wywołać funkcję z konsoli deweloperskiej przeglądarki)

/*
// Przykład w pliku HTML:
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Pobieranie Pliku</title>
</head>
<body>
    <button id="downloadBtnTxt">Pobierz plik TXT</button>
    <button id="downloadBtnCsv">Pobierz plik CSV (automatyczna nazwa)</button>

    <script>
        // Tutaj wklej całą funkcję downloadFileFromUrl

        async function downloadFileFromUrl(url, filename) {
          // ... (cała funkcja jak wyżej) ...
        }

        document.getElementById('downloadBtnTxt').addEventListener('click', () => {
            // Użyj publicznego linku do pliku TXT lub zastąp własnym
            const txtUrl = 'https://www.w3.org/TR/2003/REC-PNG-20031110/iso_8859-1.txt';
            downloadFileFromUrl(txtUrl, 'moj_plik.txt');
        });

        document.getElementById('downloadBtnCsv').addEventListener('click', () => {
            // Użyj publicznego linku do pliku CSV lub zastąp własnym
            // Pamiętaj o CORS! Ten link może nie zadziałać z powodu braku odpowiednich nagłówków CORS
            const csvUrl = 'https://gist.githubusercontent.com/Birssan/fc40a916f884597915e6660d26978813/raw/9df97723e4e59e2a9d1f9510397c3e9998d9895d/sample.csv';
            downloadFileFromUrl(csvUrl); // Spróbuje automatycznie wykryć nazwę
        });
    </script>
</body>
</html>
*/