import { defineStage } from '../define'
import { cf, cfSet, ex, py } from '../links'

export const strings = defineStage('strings', [
  {
    id: 's-indexing',
    title: 'String indexing',
    description: 'Strings are sequences of characters indexed like lists: s[0] is the first character and s[-1] the last. Unlike lists, strings are immutable — you cannot assign to s[i].',
    prerequisites: ['a-indexing'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Read individual characters by index', 'Explain why s[0] = "x" fails', 'Convert to a list when you need to edit characters'],
    syntax: `s = input()
s[0], s[-1]
chars = list(s); chars[0] = "X"; s = "".join(chars)`,
    commonMistakes: ['Trying to modify a string in place.', 'Reading a string with sys.stdin.readline and forgetting the trailing newline counts as a character.'],
    exercises: [ex('Print the first and last character of a word.'), cf(281, 'A', 'Word Capitalization')],
    resources: [py('library/stdtypes.html#text-sequence-type-str', 'str type — Python docs')],
  },
  {
    id: 's-slicing',
    title: 'String slicing',
    description: 's[start:stop:step] extracts a substring using the same half-open rule as range(). Omitted bounds default to the ends, and slices never raise IndexError — they just get shorter.',
    prerequisites: ['s-indexing'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Take prefixes, suffixes and middles', 'Use a step to take every k-th character', 'Know that slicing copies (O(length))'],
    syntax: `s[:3]      # first 3
s[-3:]     # last 3
s[1:-1]    # drop first and last
s[::2]     # every second char
s[::-1]    # reversed`,
    commonMistakes: ['Slicing inside a loop on long strings, creating O(n²) work.'],
    exercises: [cf(71, 'A', 'Way Too Long Words'), ex('Check whether a string starts and ends with the same 2 characters.')],
  },
  {
    id: 's-iterate',
    title: 'Iterating through characters',
    description: 'for ch in s visits each character. Combine it with an accumulator, a counter or a flag exactly as with lists — strings are just another sequence.',
    prerequisites: ['s-indexing', 'l-for'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Loop over characters and their positions', 'Build a new string with a list and "".join()', 'Avoid s += ch in long loops'],
    syntax: `out = []
for ch in s:
    if ch != "a":
        out.append(ch)
print("".join(out))`,
    commonMistakes: ['Building strings with repeated += on very large inputs (can be slow).'],
    exercises: [cf(118, 'A', 'String Task'), cf(282, 'A', 'Bit++')],
  },
  {
    id: 's-compare',
    title: 'Character comparisons',
    description: 'Characters compare by their Unicode code points: "a" < "b" and "A" < "a". ord() gives the code, chr() goes back, and methods like isdigit(), isalpha(), isupper() classify characters.',
    prerequisites: ['s-iterate'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Classify characters with isdigit/isalpha/isupper/islower', 'Convert letters to 0–25 with ord(ch) - ord("a")', 'Compare strings case-insensitively with lower()'],
    syntax: `ord("a") == 97
chr(ord("a") + 2) == "c"
idx = ord(ch) - ord("a")     # 0..25
s1.lower() == s2.lower()`,
    commonMistakes: ['Assuming "Z" > "a"; uppercase letters come first.'],
    exercises: [cf(112, 'A', 'Petya and Strings'), cf(131, 'A', 'cAPS lOCK')],
    resources: [py('library/functions.html#ord', 'ord() — Python docs'), py('library/functions.html#chr', 'chr() — Python docs')],
  },
  {
    id: 's-count',
    title: 'Counting characters',
    description: 's.count(sub) counts non-overlapping occurrences. For classification counts (vowels, digits, uppercase) a loop with a condition or sum() over a generator is clearer.',
    prerequisites: ['s-iterate', 'l-counting'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Count a single character with count()', 'Count characters from a category', 'Know that count() does not count overlapping matches'],
    syntax: `s.count("a")
vowels = sum(ch in "aeiou" for ch in s)
upper = sum(ch.isupper() for ch in s)`,
    commonMistakes: ['Expecting "aaa".count("aa") to be 2 (it is 1).'],
    exercises: [cf(59, 'A', 'Word'), cf(110, 'A', 'Nearly Lucky Number'), cf(734, 'A', 'Anton and Danik')],
  },
  {
    id: 's-reverse',
    title: 'String reversal',
    description: 's[::-1] reverses a string in one step. Reversal is also the building block for palindromes, comparing a word with its "mirror", and processing numbers digit by digit from the right.',
    prerequisites: ['s-slicing'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    objectives: ['Reverse a string with slicing', 'Reverse with a loop to understand the mechanics', 'Reverse the order of words in a sentence'],
    syntax: `s[::-1]
" ".join(reversed(line.split()))`,
    commonMistakes: ['Calling reversed(s) and printing it directly — it is an iterator, not a string.'],
    exercises: [cf(41, 'A', 'Translation'), ex('Reverse the order of words but not the letters in each word.')],
  },
  {
    id: 's-palindrome',
    title: 'Palindromes',
    description: 'A palindrome reads the same in both directions. Check it with s == s[::-1], or with two indices moving inward — the version that generalises to "how many changes make this a palindrome".',
    prerequisites: ['s-reverse', 's-compare'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Check a palindrome with slicing and with two indices', 'Count mismatched pairs', 'Handle odd and even lengths'],
    syntax: `is_pal = s == s[::-1]
bad = sum(s[i] != s[-1 - i] for i in range(len(s) // 2))`,
    commonMistakes: ['Looping i up to len(s) and double counting each pair.'],
    exercises: [ex('Print the minimum number of character changes to make s a palindrome.'), ex('Check whether a number is a palindrome without converting it to a string.')],
  },
  {
    id: 's-frequency',
    title: 'Character frequency',
    description: 'A 26-slot count list or collections.Counter tells you how many of each letter a string has. Two strings are anagrams exactly when their frequency tables match.',
    prerequisites: ['s-count', 'a-frequency'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['Build a 26-letter frequency list', 'Use Counter for arbitrary characters', 'Decide anagrams and "can be rearranged into a palindrome"'],
    syntax: `cnt = [0] * 26
for ch in s:
    cnt[ord(ch) - ord("a")] += 1

from collections import Counter
Counter(a) == Counter(b)          # anagrams
odd = sum(v % 2 for v in Counter(s).values())`,
    commonMistakes: ['Using a 26-slot list when the string can contain uppercase or digits.'],
    exercises: [cf(236, 'A', 'Boy or Girl'), cf(520, 'A', 'Pangram'), cf(141, 'A', 'Amusing Joke')],
    resources: [py('library/collections.html#collections.Counter', 'collections.Counter')],
  },
  {
    id: 's-manipulation',
    title: 'Basic string manipulation',
    description: 'The string methods you will reach for most: split/join, strip, replace, upper/lower, startswith/endswith, find. Combine them with list building to transform text in O(n).',
    prerequisites: ['s-slicing', 's-iterate', 'p-decompose'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Transform a string with replace, upper, lower and join', 'Parse structured text with split', 'Choose join over repeated concatenation'],
    syntax: `"+".join(sorted(s.split("+")))
s.replace("WUB", " ").split()
s.strip(), s.startswith("ab"), s.find("x")  # -1 if missing`,
    commonMistakes: ['Forgetting that replace returns a new string — s.replace(...) alone does nothing.'],
    exercises: [cf(339, 'A', 'Helpful Maths'), cf(118, 'A', 'String Task')],
    resources: [py('library/stdtypes.html#string-methods', 'String methods — Python docs'), cfSet(['strings', '800-800'], 'Codeforces: strings, rated 800')],
  },
])
