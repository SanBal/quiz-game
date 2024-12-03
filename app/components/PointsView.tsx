import React, { useState } from 'react'
import { Difficulty } from '../model/Difficulty'
import { Category } from '../model/Category';

interface PointsProperties {
  points: number;
}

const PointsView: React.FC<PointsProperties> = ({ points }) => {
  return (
    <div className="absolute top-4 right-4 text-3xl font-bold">{points}P</div>
  )
}

export default PointsView