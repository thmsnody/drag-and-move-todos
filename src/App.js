import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 } from 'uuid'
import './App.scss'

export default function App() {
  const [text, setText] = useState('')
  const [state, setState] = useState({
    todo: {
      title: 'Todo',
      items: [
        {
          id: v4(),
          name: 'You can',
        },
        {
          id: v4(),
          name: 'Add new todo',
        },
        {
          id: v4(),
          name: 'Grap and move',
        },
        {
          id: v4(),
          name: 'Delete',
        },
      ],
    },
    progress: {
      title: 'In Progress',
      items: [
        {
          id: v4(),
          name: 'Hi',
        },
      ],
    },
    done: {
      title: 'Completed',
      items: [
        {
          id: v4(),
          name: 'Work',
        },
        {
          id: v4(),
          name: 'Eat',
        },
        {
          id: v4(),
          name: 'Sleep',
        },
      ],
    },
  })

  const handleDragEnd = ({ destination, source }) => {
    if (
      !destination ||
      (destination.index === source.index &&
        destination.droppableId === source.droppableId)
    ) {
      return
    }
    const itemCopy = { ...state[source.droppableId].items[source.index] }
    setState((pre) => {
      pre = { ...pre }
      pre[source.droppableId].items.splice(source.index, 1)
      pre[destination.droppableId].items.splice(destination.index, 0, itemCopy)
      return pre
    })
  }

  const addItem = (e) => {
    e.preventDefault()
    setState((pre) => ({
      ...pre,
      todo: {
        title: 'Todo',
        items: [
          {
            id: v4(),
            name: text,
          },
          ...pre.todo.items,
        ],
      },
    }))
    setText('')
  }

  const deleteItem = (key, id) => {
    console.log(state[key])
    setState((pre) => ({
      ...pre,
      [key]: {
        title: state[key].title,
        items: state[key].items.filter((x) => x.id !== id),
      },
    }))
  }

  return (
    <div className='App'>
      <h1>
        <span>Drag & Move</span> <span>your todos</span>
      </h1>
      <form>
        <label>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addItem}>Add</button>
        </label>
      </form>
      <div className='columns-box'>
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(state).map((x, i) => {
            return (
              <div className='column' key={i}>
                <div className='column-title'>{state[x].title}</div>
                <Droppable droppableId={x}>
                  {(provided, snapshot) => {
                    return (
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className='droppable-col'
                      >
                        {state[x].items.map((y, i2) => {
                          return (
                            <Draggable draggableId={y.id} index={i2} key={y.id}>
                              {(provided, snapshot) => {
                                return (
                                  <li
                                    className={`item ${
                                      snapshot.isDragging && 'dragging'
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {y.name}
                                    <span onClick={() => deleteItem(x, y.id)}>
                                      X
                                    </span>
                                  </li>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </ul>
                    )
                  }}
                </Droppable>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}
