# SUCCULENT

It is a project. That is a webpage. With text.

## things

- looks neat <http://cadrpear.tx0.org/wordsalad/salad.html>

### capture output

- JSON of visible items (order?)
- <https://www.npmjs.com/package/html-to-image>

### split output

1. to find "words" etc.
1. break at percentage chance
1. see charng for example in poetrygen

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
