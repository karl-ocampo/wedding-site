# Wedding Seat Lookup

A static guest seat lookup for GitHub Pages. No build step or server-side code is needed.

## Edit the guest list

Update `guests.json`. Each guest needs one or more given names, a last name, and a seat assignment:

```json
[
  {
    "firstNames": ["John", "Albert"],
    "lastName": "Santos",
    "seatNumber": "Table 12, Seat 4"
  }
]
```

Guests can search with any one of their listed given names and their full last name, or enter multiple listed given names. For example, John Albert Santos can enter `John Santos`, `Albert Santos`, or `John Albert Santos`. If that combination matches multiple people, the page asks for another given name instead of choosing a seat at random.

## Publish with GitHub Pages

1. Create a GitHub repository and add these files to its root. The repository must be public to use GitHub Pages on GitHub Free.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
4. Wait for the Pages deployment to finish. The site URL will appear in the Pages settings.

After changing `guests.json`, commit and push the update; Pages will publish it automatically.

## Privacy

GitHub Pages is a public static site. Anyone can inspect or download `guests.json`, including the guest list and seat assignments. Do not put private information in this file. If the seating data must be private, this static GitHub Pages approach is not suitable without a separate authenticated backend.