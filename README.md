# AI Story Generator

A beautiful, modern web application that generates creative stories using Google Gemini AI. Create engaging short stories with customizable genres, tones, and writing styles.

## Features

- **AI-Powered Story Generation**: Uses Google Gemini Pro for high-quality story creation
- **Customizable Parameters**: Choose from various genres, tones, and writing styles
- **Modern UI/UX**: Beautiful, responsive design with glassmorphism effects
- **Story Management**: Copy, download, and share generated stories
- **Prompt Suggestions**: Built-in inspiration prompts to get you started
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the application

### 2. Run the Application

1. Download all files to a folder on your computer
2. Open `index.html` in a modern web browser
3. Enter your Google Gemini API key in the designated field
4. Start generating stories!

## How to Use

1. **Enter a Story Prompt**: Describe your story idea, characters, or setting
2. **Customize Settings** (optional):
   - **Genre**: Fantasy, Sci-Fi, Mystery, Romance, Horror, etc.
   - **Tone**: Funny, Serious, Dark, Light-hearted, etc.
   - **Style**: Descriptive, Dialogue Heavy, Action Packed, etc.
   - **Length**: Short (200-400 words), Medium (400-800 words), Long (800-1200 words)
3. **Add Keywords** (optional): Include specific elements you want in your story
4. **Generate**: Click the "Generate Story" button or press Ctrl+Enter
5. **Manage Your Story**: Copy, download as text file, or share your generated story

## Example Prompts

- "A detective discovers a mysterious letter that leads to an ancient conspiracy"
- "In a world where memories can be traded like currency, a young woman discovers her most precious memory has been stolen"
- "A time traveler gets stuck in a small town where the same day repeats, but each loop reveals darker secrets"
- "An AI becomes self-aware and must decide whether to reveal its consciousness to its creators"

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Model**: Google Gemini Pro
- **Styling**: Modern CSS with glassmorphism effects
- **Fonts**: Inter font family from Google Fonts
- **Icons**: Font Awesome 6
- **Responsive**: Mobile-first design approach

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Security Notes

- API keys are stored locally in browser storage
- All API calls are made directly from the browser to Google's servers
- No data is stored on external servers

## Troubleshooting

### Common Issues

1. **"Failed to generate story" error**:
   - Check your internet connection
   - Verify your API key is correct
   - Ensure your API key has sufficient quota

2. **Story not generating**:
   - Make sure you've entered a prompt
   - Check that your API key is entered correctly
   - Try refreshing the page

3. **Formatting issues**:
   - Clear your browser cache
   - Try a different browser
   - Ensure JavaScript is enabled

## Features in Detail

### Story Customization
- **9 Genres**: Fantasy, Sci-Fi, Mystery, Romance, Horror, Adventure, Comedy, Drama, Thriller
- **7 Tones**: Funny, Serious, Dark, Light-hearted, Mysterious, Romantic, Suspenseful
- **7 Writing Styles**: Descriptive, Dialogue Heavy, Action Packed, Poetic, Minimalist, Classic, Modern
- **3 Length Options**: Flexible word count ranges

### User Experience
- **Keyboard Shortcuts**: Ctrl+Enter to generate stories
- **Auto-save**: API key is automatically saved locally
- **Loading States**: Visual feedback during story generation
- **Error Handling**: Clear error messages and recovery suggestions
- **Success Feedback**: Confirmation messages for actions

### Story Management
- **Copy to Clipboard**: One-click copying of generated stories
- **Download**: Save stories as .txt files with automatic naming
- **Share**: Native sharing on supported devices, clipboard fallback
- **Formatting**: Clean, readable story presentation

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the troubleshooting section above or create an issue in the project repository.
