# SUCCULENT

It is a project. That is a webpage. With text.

<https://michaelpaulukonis.github.io/succulent/>

## things

- looks neat <http://cadrpear.tx0.org/wordsalad/salad.html>

- rewire boxes slowly
- don't change ALL the text, just _some_ of it
- beginning, middle, end
- keep size the same
- but that can change some _other_ way....

### capture output

- JSON of visible items (order?)
- <https://www.npmjs.com/package/html-to-image>

### split output

Looked at but did not use:

- <https://raw.githubusercontent.com/javazen/travesty/master/src/travesty.js>
- <https://raw.githubusercontent.com/ZVK/Dissociator/master/dissociator.js>

```csharp
public override IList<string> Split(string subject)
{
    /* Goal: Tokenize words and punctuation
        * That is, a word is one token, the next group of puncts are another token
        * NOTE: that is incorrect. all of the puncts are SEPARATE TOKENS, not as a group
        * for this, we use an algortihm, not a regex
        */

    subject = this.Clean(subject);

    var tokens = new List<string>();
    var token = string.Empty;
    foreach (char c in subject)
    {
        // if we're processing letters, and we find a letter, append to word
        var inWord = (char.IsLetter(c));
        if (inWord)
        {
            token += c;
        }
        else
        {
            if (token != string.Empty)
            {
                tokens.Add(token);
                token = string.Empty;
            }
            tokens.Add(c.ToString());
        }
    }

    return tokens;
}
```
