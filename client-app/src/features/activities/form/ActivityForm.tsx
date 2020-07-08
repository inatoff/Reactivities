import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';

interface IProps {
    setEditmode: (editMode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
}

const ActivityForm: React.FC<IProps> = ({ setEditmode, activity: initialFormState, createActivity, editActivity, submitting }) => {

    const initializeForm = () => {
        if (initialFormState) return initialFormState;
        else return {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            city: '',
            venue: ''
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    }

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder='Title' name='title' onChange={handleInputChange} value={activity.title} />
                <Form.TextArea rows={2} placeholder='Description' name='description' onChange={handleInputChange} value={activity.description} />
                <Form.Input placeholder='Category' name='category' onChange={handleInputChange} value={activity.category} />
                <Form.Input type='datetime-local' placeholder='Date' name='date' onChange={handleInputChange} value={activity.date} />
                <Form.Input placeholder='City' name='city' onChange={handleInputChange} value={activity.city} />
                <Form.Input placeholder='Venue' name='venue' onChange={handleInputChange} value={activity.venue} />
                <Button floated='right' onClick={handleSubmit} positive type='submit' content='Submit' loading={submitting}/>
                <Button floated='right' onClick={() => setEditmode(false)} type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default ActivityForm
