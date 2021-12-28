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
using System.Windows.Media.Animation;
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

        public DateTime?[] queryTime;

        public ThingAirQualityStatus[] networkStatuses;
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
        //   private DateTime?[] queryTime;
        //   private ThingAirQualityStatus[] networkStatuses;

        private float graphPlotHight = 75;
        private float graphTopY = 75;
        private readonly float graphStartX = 0;
        private readonly int stepLocal = 0;

        private RelationLineControl selectLineControl;
        private RelationLineControl topLineControl;
        private RelationLineControl minLineControl;

        private readonly List<FrameworkElement> temporaryElements = new List<FrameworkElement>();
        private readonly List<RelationLineControl> temporaryLineElements = new List<RelationLineControl>();

        private GraphDrawInfo graphDataInfo;

        //TODO: date boxes

        protected float _LowWarningTrap = float.NaN;
        public float LowWarningTrap
        {
            get => _LowWarningTrap;
            set => _LowWarningTrap = value;
        }

        protected float _HighWarningTrap = float.NaN;
        public float HighWarningTrap
        {
            get => _HighWarningTrap;
            set => _HighWarningTrap = value;
        }

        protected float _LowDangerTrap = float.NaN;
        public float LowDangerTrap
        {
            get => _LowDangerTrap;
            set => _LowDangerTrap = value;
        }

        protected float _HighDangerTrap = float.NaN;
        public float HighDangerTrap
        {
            get => _HighDangerTrap;
            set => _HighDangerTrap = value;
        }

        public GraphControl()
        {
            InitializeComponent();
        }

        public void Update(float?[] data, DateTime?[] queryTime, ThingAirQualityStatus[] networkStatuses)
        {
            this.data = data;
            //this.queryTime = queryTime;
            //this.networkStatuses = networkStatuses;

            bool isNulls = false;
            bool allIsNulls = true;
            graphData = new float?[data.Length];
            data.CopyTo(graphData, 0);
            for (int i = 0; i < graphData.Length; i++)
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
                else
                {
                    allIsNulls = false;
                }
            }

            //Clean previously data controls 
            GraphPath.Data = null;

            ValuePointer.Visibility =
            CenterValuePointer.Visibility =
            SelectedValuePanel.Visibility = Visibility.Hidden;
            selectLineControl?.Hide();

            for (int i = 0; i < temporaryElements.Count; i++)
            {
                GraphGrid.Children.Remove(temporaryElements[i]);
                temporaryElements[i] = null;
            }

            temporaryElements.Clear();

            for (int i = 0; i < temporaryLineElements.Count; i++)
            {
                temporaryLineElements[i].RemoveRelationLine();
                temporaryLineElements[i] = null;
            }

            temporaryLineElements.Clear();

            //Draw data controls if exists
            if (!allIsNulls)
            {

                graphDataInfo = Draw(graphData, GraphPath, queryTime, networkStatuses);

                if (string.IsNullOrEmpty(graphDataInfo.result))
                {
                    graphData = graphDataInfo.processedDataToDraw;

                    _TopValueTextBlock.Text = data[graphDataInfo.maxLocalValueIndex].ToString();
                    _TopValueDateTextBlock.Text = queryTime[graphDataInfo.maxLocalValueIndex].ToString();
                    TopValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.maxLocalValueIndex]);
                    TopValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.maxLocalValueIndex]);
                    TopCenterValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.maxLocalValueIndex]);
                    TopCenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.maxLocalValueIndex]);

                    topLineControl.DrawRelationLine(App.Current.Resources["OWLOSWarningAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSWarning"] as SolidColorBrush);
                    topLineControl.UpdatePositions();

                    _MinValueTextBlock.Text = data[graphDataInfo.minLocalValueIndex].ToString();
                    _MinValueDateTextBlock.Text = queryTime[graphDataInfo.minLocalValueIndex].ToString();
                    MinValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.minLocalValueIndex]);
                    MinValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.minLocalValueIndex]);
                    MinCenterValuePointer.SetValue(Canvas.LeftProperty, (double)graphDataInfo.processedDataX[graphDataInfo.minLocalValueIndex]);
                    MinCenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[graphDataInfo.minLocalValueIndex]);

                    minLineControl.DrawRelationLine(App.Current.Resources["OWLOSInfoAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSInfo"] as SolidColorBrush);
                    minLineControl.UpdatePositions();

                    try
                    {
                        //High-Low Warning and Danger traps ----------------------------------------------------------------------------------------------------------------------------------------------------
                        //--- HIGHDANGER
                        HighDangerTrapRect.Visibility = HighDangerTrapLine.Visibility = HighDangerTrapTextBlock.Visibility = Visibility.Hidden;
                        float? graphHighMinHeightDate = data[graphDataInfo.maxLocalValueIndex] - data[graphDataInfo.minLocalValueIndex];
                        if (graphHighMinHeightDate == null)
                        {
                            graphHighMinHeightDate = data[graphDataInfo.maxLocalValueIndex];
                        }
                        float graphHighMinHeightPixels = 0;
                        float graphHighMinStep = 0;
                        if (graphHighMinHeightDate != null)
                        {
                            if (graphHighMinHeightDate != 0)
                            {
                                graphHighMinHeightPixels = (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex];
                                graphHighMinStep = graphHighMinHeightPixels / (float)graphHighMinHeightDate;
                                if (data[graphDataInfo.maxLocalValueIndex] >= HighDangerTrap)
                                {
                                    double hightDangerRectHeight = ((float)data[graphDataInfo.maxLocalValueIndex] - HighDangerTrap) * graphHighMinStep;

                                    if (hightDangerRectHeight > graphHighMinHeightPixels)
                                    {
                                        hightDangerRectHeight = graphHighMinHeightPixels + 10;
                                    }

                                    HighDangerTrapRect.Visibility = HighDangerTrapLine.Visibility = HighDangerTrapTextBlock.Visibility = Visibility.Visible;
                                    Canvas.SetTop(HighDangerTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex]);
                                    HighDangerTrapRect.Height = hightDangerRectHeight;

                                    HighDangerTrapLine.Y1 = HighDangerTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightDangerRectHeight;

                                    HighDangerTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightDangerRectHeight + 4, 0, 0);
                                    HighDangerTrapTextBlock.Text = ">> " + HighDangerTrap.ToString();
                                }
                            }
                        }
                        //ENDOF HIGHDANGER ---
                        //--- HIGHWARNING                

                        HighWarningTrapRect.Visibility = HighWarningTrapLine.Visibility = HighWarningTrapTextBlock.Visibility = Visibility.Hidden;
                        if (graphHighMinHeightDate != null)
                        {

                            if (graphHighMinHeightDate != 0)
                            {
                                if (data[graphDataInfo.maxLocalValueIndex] >= HighWarningTrap)
                                {
                                    double hightWarningRectHeight = ((float)data[graphDataInfo.maxLocalValueIndex] - HighWarningTrap) * graphHighMinStep;

                                    if (hightWarningRectHeight > graphHighMinHeightPixels)
                                    {
                                        hightWarningRectHeight = graphHighMinHeightPixels + 25;
                                    }

                                    HighWarningTrapRect.Visibility = HighWarningTrapLine.Visibility = HighWarningTrapTextBlock.Visibility = Visibility.Visible;
                                    Canvas.SetTop(HighWarningTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex]);
                                    HighWarningTrapRect.Height = hightWarningRectHeight;

                                    HighWarningTrapLine.Y1 = HighWarningTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightWarningRectHeight;

                                    HighWarningTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex] + hightWarningRectHeight + 4, 0, 0);
                                    HighWarningTrapTextBlock.Text = "> " + HighWarningTrap.ToString();
                                }
                            }
                        }
                        //ENDOF HIGHWARNING ---
                        //--- LOWDANGER
                        LowDangerTrapRect.Visibility = LowDangerTrapLine.Visibility = LowDangerTrapTextBlock.Visibility = Visibility.Hidden;
                        float? graphLowMinHeightDate = data[graphDataInfo.maxLocalValueIndex] - data[graphDataInfo.minLocalValueIndex];
                        if (graphLowMinHeightDate == null)
                        {
                            graphLowMinHeightDate = data[graphDataInfo.maxLocalValueIndex];
                        }
                        float graphLowMinHeightPixels = 0;
                        float graphLowMinStep = 0;
                        if (graphLowMinHeightDate != 0)
                        {
                            graphLowMinHeightPixels = (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - (float)graphDataInfo.processedDataToDraw[graphDataInfo.maxLocalValueIndex];
                            graphLowMinStep = graphLowMinHeightPixels / (float)graphLowMinHeightDate;
                            if (data[graphDataInfo.minLocalValueIndex] <= LowDangerTrap)
                            {
                                double hightDangerRectHeight = (LowDangerTrap - (float)data[graphDataInfo.minLocalValueIndex]) * graphLowMinStep;

                                if (hightDangerRectHeight > graphLowMinHeightPixels)
                                {
                                    hightDangerRectHeight = graphLowMinHeightPixels + 10;
                                }

                                LowDangerTrapRect.Visibility = LowDangerTrapLine.Visibility = LowDangerTrapTextBlock.Visibility = Visibility.Visible;
                                Canvas.SetTop(LowDangerTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightDangerRectHeight);
                                LowDangerTrapRect.Height = hightDangerRectHeight;

                                LowDangerTrapLine.Y1 = LowDangerTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightDangerRectHeight;

                                LowDangerTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightDangerRectHeight + 4, 0, 0);
                                LowDangerTrapTextBlock.Text = "<< " + LowDangerTrap.ToString();
                            }
                        }
                        //ENDOF LOWDANGER ---
                        //--- LOWWARNING                
                        LowWarningTrapRect.Visibility = LowWarningTrapLine.Visibility = LowWarningTrapTextBlock.Visibility = Visibility.Hidden;
                        if (graphLowMinHeightDate != 0)
                        {
                            if (data[graphDataInfo.minLocalValueIndex] <= LowWarningTrap)
                            {
                                double hightWarningRectHeight = (LowWarningTrap - (float)data[graphDataInfo.minLocalValueIndex]) * graphLowMinStep;

                                if (hightWarningRectHeight > graphLowMinHeightPixels)
                                {
                                    hightWarningRectHeight = graphLowMinHeightPixels + 25;
                                }

                                LowWarningTrapRect.Visibility = LowWarningTrapLine.Visibility = LowWarningTrapTextBlock.Visibility = Visibility.Visible;
                                Canvas.SetTop(LowWarningTrapRect, (double)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightWarningRectHeight);
                                LowWarningTrapRect.Height = hightWarningRectHeight;

                                LowWarningTrapLine.Y1 = LowWarningTrapLine.Y2 = (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightWarningRectHeight;

                                LowWarningTrapTextBlock.Margin = new Thickness(10, (float)graphDataInfo.processedDataToDraw[graphDataInfo.minLocalValueIndex] - hightWarningRectHeight + 4, 0, 0);
                                LowWarningTrapTextBlock.Text = "< " + LowWarningTrap.ToString();
                            }
                        }
                    }
                    catch { }
                    //ENDOF LOWWARNING ---
                }

                if (isNulls)
                {
                    float?[] statusesData = new float?[data.Length + 2];
                    statusesData[0] = -5;
                    statusesData[data.Length + 1] = -5;
                    for (int i = 1; i < networkStatuses.Length + 1; i++)
                    {
                        switch (networkStatuses[i - 1])
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
                    //  Draw(statusesData, StatusGraphPath, queryTime, false);
                }
                //Make Data controls visible
                NoData.Visibility = Visibility.Hidden;

                TopValuePanel.Visibility =
                MinValuePanel.Visibility =
                TopValuePointer.Visibility =
                TopCenterValuePointer.Visibility =
                MinValuePointer.Visibility =
                MinCenterValuePointer.Visibility =
                LeftXCoordLine.Visibility =
                TopLine.Visibility =
                MinLine.Visibility = Visibility.Visible;

                topLineControl.Show();
                minLineControl.Show();

                GraphGrid_PreviewMouseMove(null, null);
            }
            else //All is NULLs
            {
                //Make Data controls unvisible
                NoData.Visibility = Visibility.Visible;

                TopValuePanel.Visibility =
                MinValuePanel.Visibility =
                HighDangerTrapTextBlock.Visibility =
                HighWarningTrapTextBlock.Visibility =
                LowDangerTrapTextBlock.Visibility =
                LowWarningTrapTextBlock.Visibility =
                TopValuePointer.Visibility =
                TopCenterValuePointer.Visibility =
                MinValuePointer.Visibility =
                MinCenterValuePointer.Visibility =
                LeftXCoordLine.Visibility =
                TopLine.Visibility =
                HighDangerTrapRect.Visibility =
                HighDangerTrapLine.Visibility =
                HighWarningTrapRect.Visibility =
                HighWarningTrapLine.Visibility =
                LowDangerTrapRect.Visibility =
                LowDangerTrapLine.Visibility =
                LowWarningTrapRect.Visibility =
                LowWarningTrapLine.Visibility =
                MinLine.Visibility = Visibility.Hidden;

                topLineControl?.Hide();
                minLineControl?.Hide();
            }
        }

        private GraphDrawInfo Draw(float?[] dataToDraw, Path path, DateTime?[] queryTime, ThingAirQualityStatus[] networkStatuses, bool dataCorrection = true)
        {
            GraphDrawInfo graphDrawInfo = new GraphDrawInfo
            {
                processedDataX = new float?[dataToDraw.Length],
                processedDataToDraw = new float?[dataToDraw.Length]
            };
            dataToDraw.CopyTo(graphDrawInfo.processedDataToDraw, 0);
            graphPlotHight = graphTopY = (int)(path.ActualHeight / 2.0f);
            graphDrawInfo.queryTime = queryTime;
            graphDrawInfo.networkStatuses = networkStatuses;


            for (int mLocal = 0; mLocal < graphDrawInfo.processedDataToDraw.Length; mLocal++)
            {
                if (graphDrawInfo.processedDataToDraw[mLocal] == null)
                {
                    continue;
                }

                if ((float.IsNaN(graphDrawInfo.maxLocalValue) || graphDrawInfo.processedDataToDraw[mLocal] > graphDrawInfo.maxLocalValue) && (dataToDraw[mLocal] != null))
                {
                    graphDrawInfo.maxLocalValue = (float)graphDrawInfo.processedDataToDraw[mLocal];
                    graphDrawInfo.maxLocalValueIndex = mLocal;
                }

                if ((float.IsNaN(graphDrawInfo.minLocalValue) || graphDrawInfo.processedDataToDraw[mLocal] < graphDrawInfo.minLocalValue) && (dataToDraw[mLocal] != null))
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


            int stepLocal = GraphPath.ActualWidth != 0 ? (int)GraphPath.ActualWidth / data.Length : (int)GraphPath.Width / data.Length;


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
                TextBlock textBlock = new TextBlock
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Top,
                    Margin = new Thickness(6, textBlockTopPosition + (textBlockYStep * i) + 12, 0, 0),
                    Foreground = App.Current.Resources["OWLOSInfoAlpha4"] as SolidColorBrush,
                    Text = (topValue - (textBlockValueStepDown * i)).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)
                };
                GraphGrid.Children.Add(textBlock);
                temporaryElements.Add(textBlock);
            }
            //--- ENDOF LOCATETEXTBLOCKS

            //NAVIGATION LINES ---
            TopLine.Y1 = TopLine.Y2 = realTopInPixels;
            MinLine.Y1 = MinLine.Y2 = realMinInPixels;
            //--- ENDOF NAVIGATION LINES

            //DATEAXESVALUES ---

            int minutesStep = 5;
            int downStep = 0;
            int rightStep = 0;
            for (int i = 0; i < graphDrawInfo.processedDataToDraw.Length; i += minutesStep)
            {

                //< Line x: Name = "LeftXCoordLine" X1 = "66" Y1 = "155" X2 = "66" Y2 = "530" Stroke = "{DynamicResource OWLOSSecondary}" StrokeThickness = "1" ></ Line >
                Line graphLine = new Line()
                {
                    X1 = 66 + rightStep,
                    X2 = 66 + rightStep,
                    Y1 = (double)graphDrawInfo.processedDataToDraw[i] + 20,
                    Y2 = 530,
                    Stroke = App.Current.Resources["OWLOSTransparent"] as SolidColorBrush,
                    StrokeThickness = 1,
                    StrokeDashArray = new DoubleCollection() { 6, 2 }
                };
                GraphGrid.Children.Add(graphLine);
                temporaryElements.Add(graphLine);

                TextBlock graphTextBlock = new TextBlock
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Top,
                    Margin = new Thickness(66 + rightStep, (double)graphDrawInfo.processedDataToDraw[i] - 10, 0, 0),
                    Foreground = App.Current.Resources["OWLOSTransparent"] as SolidColorBrush,
                    Background = App.Current.Resources["OWLOSTransparent"] as SolidColorBrush,
                    Text = dataToDraw[i].ToString(),
                    Padding = new Thickness(6),
                    Tag = graphLine
                };

                graphLine.Tag = graphTextBlock;

                GraphGrid.Children.Add(graphTextBlock);
                temporaryElements.Add(graphTextBlock);

                TextBlock textBlock = new TextBlock
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Top,
                    Margin = new Thickness(rightStep + 41, realMinInPixels + downStep * 25 + 45, 0, 0),
                    Foreground = App.Current.Resources["OWLOSInfoAlpha4"] as SolidColorBrush,
                    Text = graphDrawInfo.queryTime[i].ToString(),
                    Tag = graphLine
                };

                textBlock.MouseEnter += TimeTextBlock_MouseEnter;
                textBlock.MouseLeave += TimeTextBlock_MouseLeave;

                GraphGrid.Children.Add(textBlock);
                temporaryElements.Add(textBlock);

                downStep++;
                if (downStep > 2)
                {
                    downStep = 0;
                }
                rightStep = ((i + minutesStep) * stepLocal);

                TextBlock timeTextBlock = new TextBlock
                {
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Top,
                    Margin = new Thickness(i * stepLocal, realMinInPixels + 20, 0, 0),
                    Foreground = App.Current.Resources["OWLOSInfoAlpha4"] as SolidColorBrush,
                    Text = ""
                };
                GraphGrid.Children.Add(timeTextBlock);
                temporaryElements.Add(timeTextBlock);

                RelationLineControl timeLineControl = new RelationLineControl(GraphGrid, timeTextBlock, textBlock, GraphGrid, GraphGrid)
                {
                    margin = new Thickness(63 + i * stepLocal, realMinInPixels + 20, 0, 0)
                };

                if (graphDrawInfo.networkStatuses[i] == ThingAirQualityStatus.Online)
                {
                    textBlock.Foreground = App.Current.Resources["OWLOSInfoAlpha4"] as SolidColorBrush;
                    timeLineControl.DrawRelationLine(App.Current.Resources["OWLOSInfoAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSInfoAlpha3"] as SolidColorBrush);
                }
                else
                if (graphDrawInfo.networkStatuses[i] == ThingAirQualityStatus.Offline)
                {
                    textBlock.Foreground = App.Current.Resources["OWLOSWarningAlpha4"] as SolidColorBrush;
                    timeLineControl.DrawRelationLine(App.Current.Resources["OWLOSWarningAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSWarningAlpha3"] as SolidColorBrush);
                }
                else
                {
                    textBlock.Foreground = App.Current.Resources["OWLOSDangerAlpha4"] as SolidColorBrush;
                    timeLineControl.DrawRelationLine(App.Current.Resources["OWLOSDangerAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSDangerAlpha3"] as SolidColorBrush);
                }

                temporaryLineElements.Add(timeLineControl);
            }

            //--- DATEAXESVALUES


            return graphDrawInfo;
        }

        private void TimeTextBlock_MouseEnter(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };
            (sender as TextBlock).Foreground = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Foreground).Color);
            (sender as TextBlock).Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            //graph show line 
            Line graphLine = ((sender as TextBlock).Tag as Line);
            TextBlock graphTextBlock = graphLine.Tag as TextBlock;

            ColorAnimation lineAnimation;
            lineAnimation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha4"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };
            graphTextBlock.Background =  graphLine.Stroke  = new SolidColorBrush(((SolidColorBrush)graphLine.Stroke).Color);
            graphLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, lineAnimation);
            graphTextBlock.Background.BeginAnimation(SolidColorBrush.ColorProperty, lineAnimation);

            ColorAnimation textBlockAnimation;
            textBlockAnimation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSDark"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };
            graphTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)graphTextBlock.Foreground).Color);            
            graphTextBlock.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, textBlockAnimation);

        }

        private void TimeTextBlock_MouseLeave(object sender, MouseEventArgs e)
        {
            ColorAnimation animation;
            animation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha4"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };

            (sender as TextBlock).Foreground = new SolidColorBrush(((SolidColorBrush)(sender as TextBlock).Foreground).Color);
            (sender as TextBlock).Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);

            //hide show line 
            Line graphLine = ((sender as TextBlock).Tag as Line);
            TextBlock graphTextBlock = graphLine.Tag as TextBlock;

            ColorAnimation lineAnimation;
            lineAnimation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSTransparent"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(1.3))
            };
            graphTextBlock.Background = graphLine.Stroke = new SolidColorBrush(((SolidColorBrush)graphLine.Stroke).Color);
            graphLine.Stroke.BeginAnimation(SolidColorBrush.ColorProperty, lineAnimation);
            graphTextBlock.Background.BeginAnimation(SolidColorBrush.ColorProperty, lineAnimation);

            ColorAnimation textBlockAnimation;
            textBlockAnimation = new ColorAnimation
            {
                To = ((SolidColorBrush)App.Current.Resources["OWLOSTransparent"]).Color,
                Duration = new Duration(TimeSpan.FromSeconds(0.3))
            };
            graphTextBlock.Foreground = new SolidColorBrush(((SolidColorBrush)graphTextBlock.Foreground).Color);
            graphTextBlock.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, textBlockAnimation);

        }

        private void GraphPath_MouseMove(object sender, MouseEventArgs e)
        {
        }


        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {

            selectLineControl = new RelationLineControl(GraphGrid, SelectedValuePanel, CenterValuePointer, GraphGrid, GraphGrid);
            topLineControl = new RelationLineControl(GraphGrid, TopValuePanel, TopCenterValuePointer, GraphGrid, GraphGrid);
            minLineControl = new RelationLineControl(GraphGrid, MinValuePanel, MinCenterValuePointer, GraphGrid, GraphGrid);
            //relationLineControl.DrawRelationLine(App.Current.Resources["OWLOSInfoAlpha1"] as SolidColorBrush, App.Current.Resources["OWLOSInfo"] as SolidColorBrush);
            //relationLineControl.UpdatePositions();
        }

        private void GraphGrid_PreviewMouseMove(object sender, MouseEventArgs e)
        {            
            Point position = Mouse.GetPosition(GraphPath);
            int index = (int)(position.X / (GraphPath.ActualWidth / data.Length));

            if ((position.X > 0) && (position.Y > 80) && (position.Y < 380))
            {

                //UnitOfMeasure.Text = position.X.ToString() + " " + position.Y.ToString() + " " + index.ToString();
                if ((index >= 0) && (index < data.Length))
                {

                    //SelectedValueTextBlock.Text = "- " + data[index].ToString() + " " + DateTime.Now.AddMinutes(-(60 - index)) + "   ";
                    if (graphDataInfo != null)
                    {
                        _SelectedValueTextBlock.Text = data[index].ToString();
                        _SelectedValueDateTextBlock.Text = graphDataInfo.queryTime[index].ToString();

                        ValuePointer.SetValue(Canvas.LeftProperty, (double)(int)(position.X / 60 * 60));
                        ValuePointer.SetValue(Canvas.TopProperty, (double)graphData[index]);
                        CenterValuePointer.SetValue(Canvas.LeftProperty, position.X);
                        CenterValuePointer.SetValue(Canvas.TopProperty, (double)graphData[index]);

                        ValuePointer.Visibility =
                        CenterValuePointer.Visibility =
                        SelectedValuePanel.Visibility = Visibility.Visible;
                        selectLineControl?.Show();

                        selectLineControl.DrawRelationLine(App.Current.Resources["OWLOSSuccessAlpha3"] as SolidColorBrush, App.Current.Resources["OWLOSSuccess"] as SolidColorBrush);
                        selectLineControl.UpdatePositions();
                    }
                }
            }
        }
    }
}
