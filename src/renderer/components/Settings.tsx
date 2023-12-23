import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { changeUser, updateUser, selectUser } from '../../redux/userSlice';
import { services } from '../../services';
import { Role, Studio, User } from '../../types';
import { enumNumericValues } from '../../utils/utils';
import { useAppDispatch } from '../hooks/appStore';
import { useSelector } from 'react-redux';

interface RoleOptions {
  name: string;
  role: Role;
}

function Settings() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleOptions | null>(null);
  const [deviceId, setDeviceId] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useSelector(selectUser);

  const rolesOptions = [
    { name: 'Host', role: Role.Host },
    { name: 'Team1', role: Role.Team },
    { name: 'Team2', role: Role.Team },
  ] as RoleOptions[];

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await services.studios.list();
        setStudios(response.data);
      } catch (error) {
        console.error('Error fetching studios:', error);
      }
    };

    fetchStudios();

    const queryString = global.location.search;
    const urlParams = new URLSearchParams(queryString);
    const deviceIdFromParams = urlParams.get('deviceId');
    setDeviceId(deviceIdFromParams || '');
  }, []);

  const handleStudioClick = (studio: Studio) => {
    setSelectedStudio(studio);
  };

  const handleRoleClick = (role: RoleOptions) => {
    setSelectedRole(role);
  };

  const handleConfirmClick = async () => {
    if (selectedStudio && selectedRole != null) {
      try {
        if (currentUser) {
          const userToUpdate = {
            id: currentUser.id,
            studioId: selectedStudio.id,
            role: selectedRole.role,
            name: selectedRole.name,
          };

          await services.users.update(userToUpdate);
          dispatch(
            updateUser({
              name: selectedRole.name,
              role: selectedRole.role,
              studioId: selectedStudio.id,
            }),
          );
        } else {
          const userToCreate = {
            studioId: selectedStudio.id,
            role: selectedRole,
            deviceId,
          };

          const response = await services.users.create(userToCreate);
          if (response.data) {
            dispatch(changeUser(response.data as User));
          }
        }

        switch (selectedRole.role) {
          case Role.Host:
            navigate('/select-game-mode');
            break;
          case Role.Team:
            navigate('/welcome-team');
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error confirming:', error);
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '100px',
          fontSize: '30px',
        }}
      >
        Device settings
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginRight: '150px' }}>
          <div style={{ fontSize: '24px', marginBottom: '40px' }}>
            Select studio
          </div>
          {studios.map((studio, index) => (
            <button
              type="button"
              key={`${studio.id} + ${index}`}
              onClick={() => handleStudioClick(studio)}
              style={{
                margin: '5px',
                padding: '10px',
                display: 'block',
                backgroundColor:
                  selectedStudio === studio ? 'lightblue' : 'white',
                minWidth: '150px',
                marginBottom: '20px',
              }}
            >
              {studio.name}
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '24px', marginBottom: '40px' }}>
            Select role
          </div>
          {rolesOptions.map((role) => (
            <button
              type="button"
              key={role.name}
              onClick={() => handleRoleClick(role)}
              style={{
                margin: '5px',
                padding: '10px',
                display: 'block',
                backgroundColor:
                  selectedRole?.name === role.name ? 'lightblue' : 'white',
                minWidth: '150px',
                marginBottom: '20px',
              }}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50px',
        }}
      >
        <button
          type="button"
          onClick={handleConfirmClick}
          style={{
            backgroundColor: 'rgb(239, 158, 86)',
            width: '250px',
          }}
        >
          Assign device
        </button>
      </div>
    </div>
  );
}

export default Settings;
