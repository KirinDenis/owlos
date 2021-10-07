/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using OWLOSEcosystemService.DTO.Things;
using OWLOSThingsManager.EcosystemExplorer;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    public class GraphDrawInfo
    {
        public string result = string.Empty;

        public float maxLocalValue = float.NaN;
        public int maxLocalValueIndex = -1;
        
        public float minLocalValue = float.NaN;
        public int minLocalValueIndex = -1;
        
        public float?[] processedDataToDraw;
        public float?[] processedDataX;
    }

    /// <summary>
    /// Interaction logic for GraphControl.xaml
    /// </summary>
    public partial class GraphControl : UserControl
    {

        public string Caption
        {
            get => _Caption != null ? _Caption.Text : string.Empty;
            set
            {
                if (_Caption != null)
                {
                    _Caption.Text = value;
                }
            }
        }

        private float?[] data;
        private float?[] graphData;
        private DateTime?[] queryTime;
        private ThingAirQualityStatus[] networkStatuses;

        private float graphPlotHight = 75;
        private float graphTopY = 75;
        private readonly float graphStartX = 0;
        private readonly int stepLocal = 0;

        private RelationLineControl selectLineControl;
        private RelationLineControl topLineControl;
        private RelationLineControl minLineControl;

        private List<TextBlock> ValuesTextBoxes = new List<TextBlock>();

        //TODO: date boxes

        protected float _LowWarningTrap = float.NaN;
        public float LowWarningTrap
        {
            get => _LowWarningTrap;
            set
            {
                _LowWarningTrap = value;                
            }
        }

        protected float _HighWarningTrap = float.NaN;
        public float HighWarningTrap
        {
            get => _HighWarningTrap;
            set
            {
                _HighWarningTrap = value;                
            }
        }

        protected float _LowDangerTrap = float.NaN;
        public float LowDangerTrap
        {
            get => _LowDangerTrap;
            set
            {
                _LowDangerTrap = value;
            }
        }

        protected float _HighDangerTrap = float.NaN;
        public float HighDangerTrap
        {
            get => _HighDangerTrap;
            set
            {
                _HighDangerTrap = value;                
            }
        }

        public GraphControl()
        {
            InitializeComponent();
        }

        public void Update(float?[] data, DateTime?[] queryTime, ThingAirQualityStatus[] networkStatuses)
        {
            this.data = data;
            this.queryTime = queryTime;
            this.networkStatuses = networkStatuses;

            bool isNulls = false;
            graphData = new float?[data.Length];
            data.CopyTo(graphData, 0);
            for (int i=0; i < graphData.Length; i++)
            {
                if ((graphData[i] == null) || (float.IsNaN((float)graphData[i])))
                {
                    graphData[i] = 0.0f;
                    isNulls = true;
                    if (networkStatuses[i] == ThingAirQualityStatus.Online)
                    {
                        networkStatuses[i] = ThingAirQualityStatus.OnlineWithError;
                    }
                }
            }

            GraphDrawInfo graphDataInfo = Draw(graphData, GraphPath);

            if (string.IsNullOrEmpty(graphDataInfo.result))
            {
                graphData = graphDataInfo.processedDataToDraw;

                TopValueTextBlock.Text = "top: " + data[graphDataInfo.maxLocalValueIndex].ToString() + " " + DateTime.Now.AddMinutes(-(60 - graphDataInfo.maxLocalValueIndex)) + "   ";
                TopValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.maxLocalValueIndex]);
                TopValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.maxLocalValueIndex]);
                TopCenterValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.maxLocalValueIndex]);
                TopCenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.maxLocalValueIndex]);

                topLineControl.DrawRelationLine(App.Current.Resources["OWLOSWarningAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSWarning"] as SolidColorBrush);
                topLineControl.UpdatePositions();

                MinValueTextBlock.Text = "min: " + data[graphDataInfo.minLocalValueIndex].ToString() + " " + DateTime.Now.AddMinutes(-(60 - graphDataInfo.minLocalValueIndex)) + "   ";
                MinValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.minLocalValueIndex]);
                MinValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.minLocalValueIndex]);
                MinCenterValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.minLocalValueIndex]);
                MinCenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.minLocalValueIndex]);

                minLineControl.DrawRelationLine(App.Current.Resources["OWLOSInfoAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSInfo"] as SolidColorBrush);
                minLineControl.UpdatePositions();

                //Warning and Danger traps
                //--- TOPDANGER
                float graphTopMinHeightDate = (float)data[graphDataInfo.maxLocalValueIndex] - (float)data[graphDataInfo.minLocalValueIndex];
                float graphTopMinHeightPixels = 0;
                float graphTopMinStep = 0;
                if (graphTopMinHeightDate != 0)
                {
                    graphTopMinHeightPixels = (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex];
                    graphTopMinStep = graphTopMinHeightPixels / graphTopMinHeightDate;
                    if (data[graphDataInfo.maxLocalValueIndex] >= HighDangerTrap)
                    {
                        double hightDangerRectHeight = ((float)data[graphDataInfo.maxLocalValueIndex] - HighDangerTrap) * graphTopMinStep; // + (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex];

                        if (hightDangerRectHeight > graphTopMinHeightPixels)
                        {
                            hightDangerRectHeight = graphTopMinHeightPixels + 10;
                        }

                        TopDangerTrapRect.Visibility = TopDangerTrapLine.Visibility = TopDangerTrapTextBlock.Visibility = Visibility.Visible;
                        Canvas.SetTop(TopDangerTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex]);
                        TopDangerTrapRect.Height = hightDangerRectHeight;
                        
                        TopDangerTrapLine.Y1 = TopDangerTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightDangerRectHeight;

                        TopDangerTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightDangerRectHeight + 4, 0, 0);
                        TopDangerTrapTextBlock.Text = "danger: " + HighDangerTrap.ToString();
                    }
                    else
                    {
                        TopDangerTrapRect.Visibility = TopDangerTrapLine.Visibility = TopDangerTrapTextBlock.Visibility = Visibility.Hidden;
                    }
                }
                //ENDOF TOPDANGER ---
                //--- TOPWARNING                
                if (graphTopMinHeightDate != 0)
                {
                    if (data[graphDataInfo.maxLocalValueIndex] >= HighWarningTrap)
                    {
                        double hightWarningRectHeight = ((float)data[graphDataInfo.maxLocalValueIndex] - HighWarningTrap) * graphTopMinStep; // + (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex];

                        if (hightWarningRectHeight > graphTopMinHeightPixels)
                        {
                            hightWarningRectHeight = graphTopMinHeightPixels + 25;
                        }

                        TopWarningTrapRect.Visibility = TopWarningTrapLine.Visibility = TopWarningTrapTextBlock.Visibility = Visibility.Visible;
                        Canvas.SetTop(TopWarningTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex]);
                        TopWarningTrapRect.Height = hightWarningRectHeight;

                        TopWarningTrapLine.Y1 = TopWarningTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightWarningRectHeight;

                        TopWarningTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightWarningRectHeight + 4, 0, 0);
                        TopWarningTrapTextBlock.Text = "warning: " + HighWarningTrap.ToString();
                    }
                    else
                    {
                        TopWarningTrapRect.Visibility = TopWarningTrapLine.Visibility = TopWarningTrapTextBlock.Visibility = Visibility.Hidden;
                    }
                }
                //ENDOF TOPWARNING ---


            }

            if (isNulls)
            {
                float?[] statusesData = new float?[data.Length + 2];
                statusesData[0] = -5;
                statusesData[data.Length + 1] = -5;
                for (int i = 1; i < networkStatuses.Length+1; i++)
                {
                    switch (networkStatuses[i-1])
                    {
                        case ThingAirQualityStatus.Online:
                            statusesData[i] = -5;
                            break;
                        case ThingAirQualityStatus.Offline:
                            statusesData[i] = -1;
                            break;

                        case ThingAirQualityStatus.OnlineWithError:
                            statusesData[i] = -2;
                            break;
                        case ThingAirQualityStatus.Error:
                            statusesData[i] = -3;
                            break;
                        case ThingAirQualityStatus.ServerNotConnected:
                            statusesData[i] = -4;
                            break;
                        default:
                            statusesData[i] = -0;
                            break;
                    }
                }
                Draw(statusesData, StatusGraphPath, false);
            }
        }

        private GraphDrawInfo Draw(float?[] dataToDraw, Path path, bool dataCorrection = true)
        {
            GraphDrawInfo graphDrawInfo = new GraphDrawInfo();

            for(int i=0; i < ValuesTextBoxes.Count; i++)
            {                
                GraphGrid.Children.Remove(ValuesTextBoxes[i]);
                ValuesTextBoxes[i] = null;
            }

            ValuesTextBoxes.Clear();

            graphDrawInfo.processedDataX = new float?[dataToDraw.Length];
            graphDrawInfo.processedDataToDraw = new float?[dataToDraw.Length];
            dataToDraw.CopyTo(graphDrawInfo.processedDataToDraw, 0);
            graphPlotHight = graphTopY = (int)(path.ActualHeight / 2.0f);
            
            for (int mLocal = 0; mLocal < graphDrawInfo.processedDataToDraw.Length; mLocal++)
            {
                if (graphDrawInfo.processedDataToDraw[mLocal] == null)
                {
                    continue;
                }

                if (float.IsNaN(graphDrawInfo.maxLocalValue) || graphDrawInfo.processedDataToDraw[mLocal] > graphDrawInfo.maxLocalValue)
                {
                    graphDrawInfo.maxLocalValue = (float)graphDrawInfo.processedDataToDraw[mLocal];
                    graphDrawInfo.maxLocalValueIndex = mLocal;
                }

                if (float.IsNaN(graphDrawInfo.minLocalValue) || graphDrawInfo.processedDataToDraw[mLocal] < graphDrawInfo.minLocalValue)
                {
                    graphDrawInfo.minLocalValue = (float)graphDrawInfo.processedDataToDraw[mLocal];
                    graphDrawInfo.minLocalValueIndex = mLocal;
                }
            }

            if (float.IsNaN(graphDrawInfo.maxLocalValue))
            {
                graphDrawInfo.maxLocalValue = 0.0f;
            }

            if (float.IsNaN(graphDrawInfo.minLocalValue))
            {
                graphDrawInfo.minLocalValue = 0.0f;
            }

            
            int stepLocal = GraphPath.ActualWidth != 0? (int)GraphPath.ActualWidth / data.Length : (int)GraphPath.Width / data.Length;

            
            int halfStepLocal = stepLocal / 3; //If min == max then we decrease small value and increase big value by 10%

            if (graphDrawInfo.maxLocalValue == graphDrawInfo.minLocalValue)
            {
                graphDrawInfo.maxLocalValue += (float)(graphDrawInfo.maxLocalValue * 0.1);
                graphDrawInfo.minLocalValue -= (float)(graphDrawInfo.minLocalValue * 0.1);
            }
            else
            {
                float middleLocalValue = (graphDrawInfo.maxLocalValue - graphDrawInfo.minLocalValue) / 2;
                graphDrawInfo.maxLocalValue += middleLocalValue;
                graphDrawInfo.minLocalValue -= middleLocalValue;
            }

            float normalizeY = graphDrawInfo.maxLocalValue - graphDrawInfo.minLocalValue;
            float proportionLocal = graphPlotHight * 2.0f;
            if (normalizeY != 0)
            {
                proportionLocal = proportionLocal / normalizeY;
            }

            for (int lLocal = 0; lLocal < graphDrawInfo.processedDataToDraw.Length; lLocal++)
            {
                if (dataCorrection)
                {
                    graphDrawInfo.processedDataToDraw[lLocal] = graphTopY + (graphPlotHight - (graphDrawInfo.processedDataToDraw[lLocal] - graphDrawInfo.minLocalValue) * proportionLocal);
                }
                else
                {
                    graphDrawInfo.processedDataToDraw[lLocal] = graphTopY + (graphPlotHight - (graphDrawInfo.processedDataToDraw[lLocal] - graphDrawInfo.minLocalValue) * 4.0f);
                }
            }

            //  float topOffsetLocal = graphPlotHight + graphTopY;
            float topOffsetLocal = (int)graphDrawInfo.processedDataToDraw[graphDrawInfo.minLocalValueIndex];// (int)path.ActualHeight;
            string dLocal = "M " + graphStartX + ", " + topOffsetLocal;

            for (int nLocal = 0; nLocal < graphDrawInfo.processedDataToDraw.Length; nLocal++)
            {
                if (nLocal == 0)
                {
                    dLocal += " C " + graphStartX + ", " + graphDrawInfo.processedDataToDraw[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + graphStartX + ", " + topOffsetLocal + " " + graphStartX + ", " + graphDrawInfo.processedDataToDraw[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " ";
                }
                else
                {
                    float s1 = float.NaN;
                    float s2 = float.NaN;
                    float s3 = float.NaN;
                    if (dataCorrection)
                    {
                        s1 = graphStartX + nLocal * stepLocal - halfStepLocal * 2;
                        s2 = graphStartX + nLocal * stepLocal - halfStepLocal;
                        s3 = graphStartX + nLocal * stepLocal;
                    }
                    else
                    {
                        s1 = graphStartX + (nLocal - 1) * stepLocal - halfStepLocal * 2;
                        s2 = graphStartX + (nLocal - 1) * stepLocal - halfStepLocal;
                        s3 = graphStartX + (nLocal - 1) * stepLocal;
                    }
                    dLocal += " C " + s1 + ", " + graphDrawInfo.processedDataToDraw[nLocal - 1]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + s2 + ", " + graphDrawInfo.processedDataToDraw[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " " + s3 + ", " + graphDrawInfo.processedDataToDraw[nLocal]?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + " ";
                }

                graphDrawInfo.processedDataX[nLocal] = graphStartX + nLocal * stepLocal;
            }

            dLocal += " C " + graphStartX + stepLocal * (graphDrawInfo.processedDataToDraw.Length - 1) + "," + topOffsetLocal + " " + graphStartX + stepLocal * (graphDrawInfo.processedDataToDraw.Length - 1) + "," + topOffsetLocal + " " + graphStartX + stepLocal * (graphDrawInfo.processedDataToDraw.Length - 1) + "," + topOffsetLocal + " ";

            try
            {
                path.Data = Geometry.Parse(dLocal);
            }
            catch (Exception e)
            {
                graphDrawInfo.result = e.Message;
                return graphDrawInfo;
            }

            //LOCATETEXTBLOCKS When we know top and min values, we can locate values text blocks on left side of the graph ---
            //ten text blocks
            float realTopInPixels = (float)graphDrawInfo.processedDataToDraw[graphDrawInfo.maxLocalValueIndex]; //in pixels from top
            float realMinInPixels = (float)graphDrawInfo.processedDataToDraw[graphDrawInfo.minLocalValueIndex]; //in pixels from top
            float textBlockTopPosition = realTopInPixels;
            float textBlockYStep = (realMinInPixels - realTopInPixels) / 10.0f; //pixels step

            float topValue = (float)dataToDraw[graphDrawInfo.maxLocalValueIndex]; 
            float minValue = (float)dataToDraw[graphDrawInfo.minLocalValueIndex]; 

            float textBlockValueStepDown = (topValue - minValue) / 10.0f;

            for (int i = 0; i < 11; i++)
            {
                TextBlock textBlock = new TextBlock();
                textBlock.HorizontalAlignment = HorizontalAlignment.Left;
                textBlock.VerticalAlignment = VerticalAlignment.Top;
                textBlock.Margin = new Thickness(6, textBlockTopPosition + (textBlockYStep * i) + 12, 0, 0);
                textBlock.Foreground = App.Current.Resources["OWLOSSecondary"] as SolidColorBrush;
                textBlock.Text = (topValue - (textBlockValueStepDown * i)).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture);
                GraphGrid.Children.Add(textBlock);
                ValuesTextBoxes.Add(textBlock);
            }
            //--- ENDOF LOCATETEXTBLOCKS

            //NAVIGATION LINES ---
            TopLine.Y1 = TopLine.Y2 = realTopInPixels;
            MinLine.Y1 = MinLine.Y2 = realMinInPixels;
            //--- ENDOF NAVIGATION LINES

            //DATEAXESVALUES ---

            DateTime dateTime = DateTime.Now.AddMinutes(-60);
            int minutesStep = 5;
            for (int i = 0; i < 60; i+= minutesStep)
            {
                TextBlock textBlock = new TextBlock();
                textBlock.HorizontalAlignment = HorizontalAlignment.Left;
                textBlock.VerticalAlignment = VerticalAlignment.Top;
                textBlock.Margin = new Thickness(76 + i * stepLocal, realMinInPixels + 35, 0, 0);
                textBlock.Foreground = App.Current.Resources["OWLOSSecondary"] as SolidColorBrush;
                textBlock.RenderTransform = new RotateTransform(90.0f);
                textBlock.Text = dateTime.ToString();
                GraphGrid.Children.Add(textBlock);
                ValuesTextBoxes.Add(textBlock);

                dateTime = dateTime.AddMinutes(minutesStep);
            }

            //--- DATEAXESVALUES


            return graphDrawInfo;
        }

        private void GraphPath_MouseMove(object sender, MouseEventArgs e)
        {
        }


        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {

            selectLineControl = new RelationLineControl(GraphGrid, SelectedValueTextBlock, CenterValuePointer, GraphGrid, GraphGrid);
            topLineControl = new RelationLineControl(GraphGrid, TopValueTextBlock, TopCenterValuePointer, GraphGrid, GraphGrid);
            minLineControl = new RelationLineControl(GraphGrid, MinValueTextBlock, MinCenterValuePointer, GraphGrid, GraphGrid);
            //relationLineControl.DrawRelationLine(App.Current.Resources["OWLOSInfoAlpha1"] as SolidColorBrush, App.Current.Resources["OWLOSInfo"] as SolidColorBrush);
            //relationLineControl.UpdatePositions();



        }

        private void GraphGrid_PreviewMouseMove(object sender, MouseEventArgs e)
        {
            Point position = e.GetPosition(GraphPath);
            int index = (int)(position.X / (GraphPath.ActualWidth / data.Length));

            if ((position.X > 0) && (position.Y > 80) && (position.Y < 380))
            {

                UnitOfMeasure.Text = position.X.ToString() + " " + position.Y.ToString() + " " + index.ToString();
                if ((index >= 0) && (index < data.Length))
                {

                    SelectedValueTextBlock.Text = "sel: " + data[index].ToString() + " " + DateTime.Now.AddMinutes(-(60 - index)) + "   ";
                    ValuePointer.SetValue(Canvas.LeftProperty, (double)(int)(position.X / 60 * 60));
                    ValuePointer.SetValue(Canvas.TopProperty, (double)graphData[index]);
                    CenterValuePointer.SetValue(Canvas.LeftProperty, position.X);
                    CenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[index]);

                    selectLineControl.DrawRelationLine(App.Current.Resources["OWLOSSuccessAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSSuccess"] as SolidColorBrush);
                    selectLineControl.UpdatePositions();
                }
            }
        }
    }
}
