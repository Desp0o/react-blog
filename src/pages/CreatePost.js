import React, { useEffect, useState, useContext } from 'react';
import {AuthContext} from '../components/AuthContext'
import ReactQuill from 'react-quill';
import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/createpost.css';
import axios from 'axios';
import BlotFormatter from 'quill-blot-formatter';

Quill.register('modules/blotFormatter', BlotFormatter);

export default function CreatePost() {
    const {currentUser} = useContext(AuthContext)
    const [content, setContent] = useState('');
    const [category, setcategory] = useState('')
    const [value, setValue] = useState({
        title: '',
        cover: '',
    });

    const sendPost = async () => {

        if(value.title.length <= 0){
            alert(`Hey ${currentUser}, please fill Title field`)
        }else if(category.length <= 0){
            alert(`Hey ${currentUser}, please choose Category`)
        }else{
            if (content.trim() !== '') {
                try {
                    const response = await axios.post('http://localhost:3300/posts', {
                        content: content,
                        ...value, category // Include title, cover, and category
                    }, { withCredentials: true });
                    
                    alert(response.data)
                    setValue({title: '', cover: ''})
                    setcategory('')
                    setContent('')
                } catch (error) {
                    
                    if(error.response.statusText === 'Payload Too Large'){
                        alert(`Hey ${currentUser}, Image size or Dimension is too large`)
                    }

                    console.log(error.response);
                }
            } else {
                console.log('Content is empty; not sending the request.');
            }
        }

        
    }

    const handleValues = (e) => {
        setValue((prevValues) => ({ ...prevValues, [e.target.name]: e.target.value }));
    }

    const modules = {
        blotFormatter: {},
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }], // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
            [{ 'direction': 'rtl' }], // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }], // text color and background color
            [{ 'font': [] }], // font family
            [{ 'align': [] }], // text alignment
            ['image'],
            ['link'], // add a link option
            ['video'], // add a video embed option
            ['clean']
        ],
        clipboard: {
            matchVisual: true,
        },
        
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'code-block',
        'align', 'video', 'formula', 'table','color', 'background', 'font', 'script', 'size', 'blockquote', 'float'
    ];

    return (
        <div className='create_post'>

            <p className='crp_title'>Create New Post</p>

            <div className='create_post_inner'>
            
                <div className='input_fields'>
                    <div className='input_parent'>
                        <input
                            className='inputStyle_editor'
                            type='text'
                            name='title'
                            placeholder='title'
                            value={value.title}
                            onChange={handleValues}
                        />
                    </div>

                    <div className='input_parent'>
                        <input
                            className='inputStyle_editor'
                            type='text'
                            name='cover'
                            placeholder='cover'
                            value={value.cover}
                            onChange={handleValues}
                        />
                    </div>

                    <div className='input_parent'>
                        <select id="selectInput" value={category} className='inputStyle_editor' onChange={(e) => setcategory(e.target.value)}>
                            <option value="">-- Select Category --</option>
                            <option value="Movie">Movie</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Sport">Sport</option>
                        </select>
                    </div>
                </div>

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className='custom_editor'
                />

                <button className='textEditorBtn' onClick={sendPost}>send</button>

            </div>
            
        </div>
    );
}
