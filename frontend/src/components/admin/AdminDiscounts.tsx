import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './AdminDiscounts.module.css';
import GameService, { IGame } from '@/API/GameService';
import DiscountService, { IDiscount } from '@/API/DiscountService';

const AdminDiscounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await DiscountService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      alert('Ошибка при загрузке скидок');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const data = await GameService.getGames();
      setGames(data);
    } catch (error) {
      alert('Ошибка при загрузке игр');
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetchGames();
  }, []);

  const handleAdd = () => {
    if (!localStorage.getItem('token')) {
      alert('Необходима авторизация');
      return;
    }
    setEditingDiscount(null);
    setFormData({});
    setModalVisible(true);
  };

  const handleEdit = (discount: IDiscount) => {
    if (!localStorage.getItem('token')) {
      alert('Необходима авторизация');
      return;
    }
    setEditingDiscount(discount);
    setFormData({
      ...discount,
      start_date: discount.start_date ? new Date(discount.start_date).toISOString().split('T')[0] : '',
      end_date: discount.end_date ? new Date(discount.end_date).toISOString().split('T')[0] : '',
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту скидку?')) {
      return;
    }

    try {
      if (!localStorage.getItem('token')) {
        alert('Необходима авторизация');
        return;
      }
      await DiscountService.deleteDiscount(id);
      alert('Скидка успешно удалена');
      fetchDiscounts();
    } catch (error) {
      alert('Ошибка при удалении скидки');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!localStorage.getItem('token')) {
        alert('Необходима авторизация');
        return;
      }

      const discountData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      if (editingDiscount) {
        await DiscountService.updateDiscount(editingDiscount.id, discountData);
        alert('Скидка успешно обновлена');
      } else {
        await DiscountService.createDiscount(discountData);
        alert('Скидка успешно создана');
      }
      setModalVisible(false);
      fetchDiscounts();
    } catch (error) {
      alert('Ошибка при сохранении скидки');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <button className={styles.addButton} onClick={handleAdd}>
        <PlusOutlined /> Добавить скидку
      </button>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Игра</th>
              <th>Скидка</th>
              <th>Начало</th>
              <th>Конец</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(discount => (
              <tr key={discount.id}>
                <td>{discount.game?.name}</td>
                <td>{discount.discount_percent}%</td>
                <td>{new Date(discount.start_date).toLocaleDateString()}</td>
                <td>{new Date(discount.end_date).toLocaleDateString()}</td>
                <td>{discount.is_active ? 'Активна' : 'Неактивна'}</td>
                <td>
                  <button className={styles.actionButton} onClick={() => handleEdit(discount)}>
                    <EditOutlined />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(discount.id)}>
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
          <h2>{editingDiscount ? 'Редактировать скидку' : 'Добавить скидку'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label>Игра</label>
              <select
                name="game_id"
                value={formData.game_id || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите игру</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Процент скидки</label>
              <input
                type="number"
                name="discount_percent"
                value={formData.discount_percent || ''}
                onChange={handleInputChange}
                min={1}
                max={99}
                required
              />
            </div>

            <div>
              <label>Дата начала</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Дата окончания</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              {editingDiscount ? 'Обновить' : 'Создать'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts; 