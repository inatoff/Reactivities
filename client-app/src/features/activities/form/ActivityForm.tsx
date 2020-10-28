import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { category } from '../../../app/common/options/categoryOptions';


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

    // const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = event.currentTarget;
    //     setActivity({ ...activity, [name]: value });
    // }

    const handleFinalFormSubmit = (values: any) => {
        console.log(values);
    }

    // const handleSubmit = () => {
    //     if (activity.id.length === 0) {
    //         let newActivity = {
    //             ...activity,
    //             id: uuid()
    //         }

    //         createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    //     } else {
    //         editActivity(activity);
    //         history.push(`/activities/${activity.id}`);
    //     }
    // }

    const handleCancel = () => {
        if (activity.id && activity.id.length > 0) {
            history.push(`/activities/${activity.id}`);
        } else {
            history.push('/activities');
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field placeholder='Title' name='title' component={TextInput} value={activity.title} />
                                <Field placeholder='Description' name='description' component={TextAreaInput} rows={3} value={activity.description} />
                                <Field placeholder='Category' name='category' component={SelectInput} options={category} value={activity.category} />
                                <Field placeholder='Date' name='date' component={TextInput} value={activity.date} />
                                <Field placeholder='City' name='city' component={TextInput} value={activity.city} />
                                <Field placeholder='Venue' name='venue' component={TextInput} value={activity.venue} />
                                <Button
                                    loading={submitting}
                                    floated='right'
                                    positive
                                    type='submit'
                                    content='Submit'
                                />
                                <Button
                                    onClick={
                                        activity.id
                                            ? () => history.push(`/activities/${activity.id}`)
                                            : () => history.push('/activities')
                                    }
                                    floated='right'
                                    type='button'
                                    content='Cancel'
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm);
