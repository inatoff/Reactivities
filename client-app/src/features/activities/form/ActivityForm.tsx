import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, activity: initialFormState,
        loadActivity, clearActivity } = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
          loadActivity(match.params.id).then(
            () => initialFormState && setActivity(initialFormState)
          );
        }
        return () => {
          clearActivity()
        }
      }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);
  
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
            
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            editActivity(activity);
            history.push(`/activities/${activity.id}`);
        }
    }

    const handleCancel = () => {
        if (activity.id && activity.id.length > 0) {
            history.push(`/activities/${activity.id}`);
        } else {
            history.push('/activities');
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
                <Button floated='right' onClick={handleSubmit} positive type='submit' content='Submit' loading={submitting} />
                <Button floated='right' onClick={handleCancel} type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);
