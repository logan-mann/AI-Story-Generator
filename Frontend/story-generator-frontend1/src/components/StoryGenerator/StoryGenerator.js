import React, {useState} from 'react';
import { generateStory, saveStory} from '../../service/stories';

export default function StoryGenerator(props) {
    const [story, setStory] = useState();
    const [error, setError] = useState();
    const [saveError, setSaveError] = useState();
    const [success, setSuccess] = useState(false);
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleGenerate = async(e) => {
        e.preventDefault();
        setSuccess(false);
        generateStory(prompt)
        .then(story => {
            setStory(story);
        })
        .catch(err => {
            console.log("Error generating story: " + err);
            setError("Error Generating Story!");
        })
    }

    const handleSave = async(e) => {
        e.preventDefault();
        console.log("TITLE_____", title)
        const storyObj = {
            title: title,
            text: story,
        }
        console.log("Story obj", JSON.stringify(storyObj))
        saveStory(storyObj, props.token)
        .then(() => {
            setSuccess(true);
        })
        .catch(err => {
            setSaveError(err);
        })
    }

    return(
        <div className="container">
            <h1>Story Generator</h1>
            <div className="card m-3">
                <div className="card-body">
                    <form onSubmit={handleGenerate}>
                        <div className="form-group">
                            <label htmlFor="prompt">Story Prompt</label>
                            <textarea className="form-control" id="prompt" rows="3" maxLength="100" aria-describedby="promptHelp" onChange={e => {setPrompt(e.target.value)}}placeholder="Example: The Roman warrior brandished his sword, "></textarea>
                            <small id="promptHelp" className="form-text text-muted">Enter in the beginning of a sentence to get the model off and running. Use your imagination!</small>
                        </div>
                        <button className="btn btn-primary" type="submit">Generate!</button>
                    </form>

                </div>
            </div>
            {story &&
                <div className="card m-3">
                    <div className="card-body">
                        <h1 className="card-title">Generated Story</h1>
                        {success && <h6 style={{color:"green"}}>Successfully saved story!</h6>}
                        {saveError && <h6 style={{color:"red"}}>Error saving story.</h6>}
                        <form onSubmit={handleSave}>
                            <div className="formGroup">
                                <label htmlFor="title">Story Title</label>
                                <input className="form-control" id="title" onChange={e => {setTitle(e.target.value)}} required type="text" maxLength="50" aria-describedby="titleHelp" placeholder="Story Title"></input>
                                <small id="titleHelp" className="form-text text-muted">Give your story a name and save it to your account to come back and view it later!</small> 
                            </div>
                            <div className="form-group">
                                <label htmlFor="story">Story Body</label>
                                <textarea className="form-control" id="story" rows="10" maxLength="1000" aria-describedby="promptHelp" readOnly value={story}></textarea>
                            </div>
                            <button type="submit" className="btn btn-success mt-2">Save Story</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}