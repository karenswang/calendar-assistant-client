import os
import requests
import json
from openai import OpenAI
import datetime
import time

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Main function to handle the entire process
def main(user_message):
    # Initialize OpenAI client
    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    # Start a new thread and add default messages
    thread = start_thread_and_add_default_msg(client)

    # Submit user message
    run = submit_message(client, thread, user_message)

    # Wait for the run to complete and get the response
    bot_message = wait_on_run(client, run, thread)

    return bot_message

def trackEvent(email, scope, groupBy=None, analysis=True):
    url = "http://localhost:3000/track"
    headers = {'Content-Type': 'application/json'}

    data = {
        "orgId": "1",
        "email": email,
        "scope": scope,
        "groupBy": groupBy if groupBy is not None else 'event',
        "analysis": analysis if analysis is not None else True
    }

    response = requests.get(url, headers=headers, data=json.dumps(data))
    return response.json()

def createEvent(email, startTime, endTime, timezone="America/New_York", summary=None, description=None, location=None):
    url = "http://localhost:3000/manage"
    headers = {'Content-Type': 'application/json'}

    data = {
        "orgId": "1",
        "email": email,
        "type": "insert",
        "startTime": startTime,
        "endTime": endTime,
        "timezone": timezone,
        "summary": summary,
        "description": description,
        "location": location
    }

    # Remove keys with None values
    data = {k: v for k, v in data.items() if v is not None}

    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()

def updateEvent(email, startTime, endTime, eventId, timezone="America/New_York", summary=None, description=None, location=None):
    url = "http://localhost:3000/manage"
    headers = {'Content-Type': 'application/json'}

    data = {
        "orgId": "1",
        "email": email,
        "type": "update",
        "eventId": eventId,
        "startTime": startTime,
        "endTime": endTime,
        "timezone": timezone,
        "summary": summary,
        "description": description,
        "location": location
    }

    # Remove keys with None values
    # data = {k: v for k, v in data.items() if v is not None}

    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()

def deleteEvent(email, eventId):
    url = "http://localhost:3000/manage"
    headers = {'Content-Type': 'application/json'}

    data = {
        "orgId": "1",
        "email": email,
        "type": "delete",
        "eventId": eventId
    }

    # Remove keys with None values
    # data = {k: v for k, v in data.items() if v is not None}

    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()


# def show_json(obj):
#     display(json.loads(obj.model_dump_json()))

# start a new thread
def start_thread_and_add_default_msg(client):
    thread = client.beta.threads.create()
    datetime = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")

    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content="my email is sw3709@columbia.edu"
    )
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=f"Current date and time is {datetime}"
    )
    return thread

def get_response(client, thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

def pretty_print(messages):
    print("# Messages")
    for m in messages:
        print(f"{m.role}: {m.content[0].text.value}")
    print()

# Add a new message to the thread and start a run
def submit_message(client, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id="asst_2x9WVVd9cMQObO4gFsMhIrbC",
        instructions="Use the approprite function tool to achieve user's specific request."
    ) 
    
# See all messages in the thread
def see_all_messages(thread):
    pretty_print(get_response(thread))
    
def wait_on_run(client, run, thread):
    while run.status in ["queued", "in_progress", "action_required"]:
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        
        # Check for "action_required" status and handle it
        if run.status == "action_required":
            submit_outputs(thread, run)

        # Only continue the loop if the status is still "queued" or "in_progress"
        if run.status not in ["queued", "in_progress"]:
            messages = client.beta.threads.messages.list(thread_id=thread.id)
            bot_message = get_latest_message(thread, messages)
            break

        time.sleep(2)

    return bot_message



# submit tool outputs
def submit_outputs(client, thread, run):
    tool_call = run.required_action.submit_tool_outputs.tool_calls[0]
    name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)
    responses = globals()[name](**arguments)
    
    run = client.beta.threads.runs.submit_tool_outputs(
    thread_id=thread.id,
    run_id=run.id,
    tool_outputs=[
        {
            "tool_call_id": tool_call.id,
            "output": json.dumps(responses),
        }
    ],
)
    
def get_latest_message(client, thread, message):
    messages = client.beta.threads.messages.list(
    thread_id=thread.id, order="asc", after=message.id
)
    return messages.data[0].content[0].text.value


bot_response = main("User's message here")
print(bot_response)