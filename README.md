# calendar-assistant-client

Step to run the project:
1. Make sure the server (calendar-assistant) is running;
2. Run the command `npm install` to install the dependencies;
3. `pip install -r requirements.txt` to install the python dependencies;
4. `cd python-flask-backend` and run `python app.py` to start the python server;
5. create a `.env` file, get your `Custom_Search_Engine_ID` and `Custom_Search_API_Key` from [Google Custom Search](https://developers.google.com/custom-search/v1/overview), or from the repo codespace secrets and put them in there.
5. open the index.html

How this app uses our [calendar assistant API](https://github.com/tchitrakorn/calendar-assistant) under the hood:
1. the log in function will send a request to the API /authenticate endpoint to finish the log in process and store crendentials;
2. the app will send a request to the API /track, /manage, /analytics endpoint to get the list of events, update, create and delete new events, as well as getting a anlytics report for this client (not end user);
3. for the /explore endpoint, we are directly implementing it on the client at this time because the significant delay in getting the response from the API (as you may notice, the response time is not ideal for the other endpoints as well, but we are working on it)
4. On top of our calendar assistant API, leverages the OpenAI Assistant API as a wrapper to decide which endpoints to call, convert user input to parameters needed by our API, and convert API response to natural language to return to the user. The explore feature also uses llamaindex to use the Google Custom Search API.

Check out demo video [here](https://drive.google.com/file/d/1XThMTPjJc1QKS5Yfwm6dJz_-fGawMcR0/view?usp=sharing)

## Dependencies and tools
For our natural language processing capabilities, Calendar Assistant primarily uses:

-   llama-index (for LLM and OpenAI)
-   OpenAI Assistant 

Please see the following for additional information about LLM and LlamaIndex:

-   [LlamaIndex introduction](https://ts.llamaindex.ai/)
-   [LlamaIndex high-level concepts](https://gpt-index.readthedocs.io/en/latest/getting_started/concepts.html#high-level-concepts)
-   [OpenAI Assistant](https://platform.openai.com/docs/assistants/overview)