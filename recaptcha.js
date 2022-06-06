import React, { useEffect, useState } from 'react';


const SITE_KEY = "test";
const EXPECTED_ACTION='submit'

function Recaptcha() {
 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
 
  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);
 
      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        //document.body.appendChild(script);
        document.getElementsByClassName('ReCaptchaDiv')[0].appendChild(script);
      }
 
      if (isScriptExist && callback) callback();
    }
 
    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`, function () {
      console.log("Script loaded!");
    });
  }, []);
 
  const handleOnClick = e => {
    e.preventDefault();
    setLoading(true);
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.execute(SITE_KEY, { action: EXPECTED_ACTION }).then(token => {
        submitData(token);
        console.log("Token: " + token);
      });
    });
  }
 
  const submitData = token => {
    // call a backend API to verify reCAPTCHA response
    fetch('http://localhost:3000/api/validateAssessment', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      "token": token,
      "expectedaction":EXPECTED_ACTION,
      })
    }).then(res => { //then(res => res.json()).
      setLoading(false);
      setResponse(res.statusText);
      console.log(res);
    });
  }
 
  return (
    <div>
      <h3>reCAPTCHA v3 in React</h3>
      <div className="box">
        <label>Name: </label>
        <input type="text" onChange={e => setName(e.target.value)} value={name} />
      </div>
      <div className="box">
        <label>Email: </label>
        <input type="text" onChange={e => setEmail(e.target.value)} value={email} />
      </div>
      <div className="ReCaptchaDiv box" />
      <button style={{"float":"left"}} className="ServiceRequest_btn" onClick={handleOnClick} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      <br /><br />
      {response && <label>Output:<br /><pre>{JSON.stringify(response, undefined, 2)}</pre></label>}
    </div>
  );
}
 
export default Recaptcha;
