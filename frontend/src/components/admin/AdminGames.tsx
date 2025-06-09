import React, { useState, useEffect } from 'react';
import GameService, { IGame } from '@/API/GameService';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './AdminGames.module.css';
import Search from '@/components/Search/Search';

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGame, setEditingGame] = useState<IGame | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState<any>({});

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await GameService.getGames();
      setGames(data);
      setFilteredGames(data);
    } catch (error) {
      alert('Ошибка при загрузке игр: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (searchValue.trim()) {
      const filtered = games.filter(game =>
        game.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames(games);
    }
  }, [searchValue, games]);

  const handleAdd = () => {
    if (!localStorage.getItem('token')) {
      alert('Необходима авторизация');
      return;
    }
    setEditingGame(null);
    setFormData({});
    setModalVisible(true);
  };

  const handleEdit = (game: IGame) => {
    if (!localStorage.getItem('token')) {
      alert('Необходима авторизация');
      return;
    }
    setEditingGame(game);
    setFormData(game);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту игру?')) {
      return;
    }
    
    try {
      if (!localStorage.getItem('token')) {
        alert('Необходима авторизация');
        return;
      }
      await GameService.deleteGame(id);
      alert('Игра успешно удалена');
      fetchGames();
    } catch (error) {
      alert('Ошибка при удалении игры: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!localStorage.getItem('token')) {
        alert('Необходима авторизация');
        return;
      }
      if (editingGame) {
        await GameService.updateGame(editingGame.id, formData);
        alert('Игра успешно обновлена');
      } else {
        await GameService.createGame(formData);
        alert('Игра успешно создана');
      }
      setModalVisible(false);
      fetchGames();
    } catch (error) {
      alert('Ошибка при сохранении игры: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Search
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchResults={[]}
          isLoading={false}
          onResultClick={() => {}}
          clearSearch={() => setSearchValue('')}
        />
      </div>

      <button className={styles.addButton} onClick={handleAdd}>
        <PlusOutlined /> Добавить игру
      </button>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map(game => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>{game.price} ₽</td>
                <td>
                  <button className={styles.actionButton} onClick={() => handleEdit(game)}>
                    <EditOutlined />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(game.id)}>
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingGame ? 'Редактировать игру' : 'Добавить игру'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label>Название</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Цена</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>

              <div>
                <label>Путь к изображению</label>
                <input
                  type="text"
                  name="img_path"
                  value={formData.img_path || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Описание</label>
                <textarea
                  name="gameInfo.description"
                  value={formData.gameInfo?.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label>Дата выпуска</label>
                <input
                  type="date"
                  name="gameInfo.release_date"
                  value={formData.gameInfo?.release_date || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Разработчик</label>
                <input
                  type="text"
                  name="gameInfo.developer"
                  value={formData.gameInfo?.developer || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Издатель</label>
                <input
                  type="text"
                  name="gameInfo.publisher"
                  value={formData.gameInfo?.publisher || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Путь к изображению в информации об игре</label>
                <input
                  type="text"
                  name="gameInfo.img"
                  value={formData.gameInfo?.img || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* <div className={styles.systemReqsSection}>
                <h3>Минимальные системные требования</h3>
                <div>
                  <label>Операционная система</label>
                  <input
                    type="text"
                    name="gameInfo.system_requirements.os"
                    value={formData.gameInfo?.system_requirements?.os || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Процессор</label>
                  <input
                    type="text"
                    name="gameInfo.system_requirements.processor"
                    value={formData.gameInfo?.system_requirements?.processor || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Оперативная память</label>
                  <input
                    type="text"
                    name="gameInfo.system_requirements.memory"
                    value={formData.gameInfo?.system_requirements?.memory || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Видеокарта</label>
                  <input
                    type="text"
                    name="gameInfo.system_requirements.graphics"
                    value={formData.gameInfo?.system_requirements?.graphics || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Место на диске</label>
                  <input
                    type="text"
                    name="gameInfo.system_requirements.storage"
                    value={formData.gameInfo?.system_requirements?.storage || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div> */}

              <button type="submit" className={styles.submitButton}>
                {editingGame ? 'Сохранить изменения' : 'Добавить игру'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGames; 