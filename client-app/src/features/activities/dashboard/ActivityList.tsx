import React, { useContext, Fragment } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import Activitystore from '../../../app/stores/activityStore';
import ActivityListItem from './ActivityListItem';


const ActivityList: React.FC = () => {
    const activityStore = useContext(Activitystore);
    const { activitiesByDate } = activityStore;
    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label size='large' color='blue'>
                        {group}
                    </Label>
                    <Item.Group divided>
                        {activities.map(activity =>
                            <ActivityListItem activity={activity} key={activity.id} />
                        )}
                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>
    )
}

export default observer(ActivityList);
